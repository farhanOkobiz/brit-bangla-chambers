import validator from "validator";

export const validatorInputs = (email, password) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  const isStrong = validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0, // symbols not required
  });

  if (!isStrong) {
    throw new Error(
      "Password must be at least 6 characters and include an uppercase letter, lowercase letter, and a number"
    );
  }

  return true; // ✅ validation passed
};
