import { User } from "../../models/userModel.js";
import { validatorInputs } from "../../utils/validatorInputs.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwtHelpers.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validate inputs
    validatorInputs(email, password);

    // 2. Find user
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check password
    const isPasswordValid = await existUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    // 4. Generate access & refresh tokens using the correct variable
    const payload = {
      _id: existUser._id,
      email: existUser.email,
      role: existUser.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ _id: existUser._id });

    // 5. Return user info + tokens
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: existUser._id,
        full_name: existUser.full_name,
        email: existUser.email,
        role: existUser.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    // Input validation error
    if (
      error.message.includes("required") ||
      error.message.includes("format") ||
      error.message.includes("Password")
    ) {
      return res.status(400).json({ message: error.message });
    }

    // Server/internal error
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
