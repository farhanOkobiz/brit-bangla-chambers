import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 8px; max-width: 400px; margin: auto;">
      <h2 style="color: #222; text-align: center;">Brit Bangla Chambers OTP Verification</h2>
      <p style="font-size: 16px; color: #444; text-align: center;">Your one-time password (OTP) is:</p>
      <div style="font-size: 32px; font-weight: bold; color: #007bff; background: #fff; padding: 16px; border-radius: 6px; text-align: center; letter-spacing: 4px; margin: 16px 0;">${otp}</div>
      <p style="font-size: 14px; color: #888; text-align: center;">This code will expire in 10 minutes.<br>If you did not request this, please ignore this email.</p>
      <div style="text-align: center; margin-top: 24px;">
        <img src="https://britbanglachambers.com/logo.png" alt="Brit Bangla Chambers" style="height: 40px;" />
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};
