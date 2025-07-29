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
  <div style="padding: 24px 30px; text-align: center; background-color: #f8fafc; font-family: Arial, sans-serif;">
  <p style="font-size: 16px; color: #0f172a; margin-bottom: 16px;">
    Please use the following code to verify your email:
  </p>

  <!-- OTP Block -->
  <div style="display: inline-block; background: #e0f2fe; border: 1px solid #38bdf8; color: #0c4a6e; font-weight: bold; font-size: 28px; padding: 14px 28px; border-radius: 8px; margin: 0 auto 20px; white-space: nowrap;">
    ${otp}
  </div>

  <!-- Instruction -->
  <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
    This code is valid for <strong>3 minutes</strong>. Please do not share it with anyone.
  </p>
  <p style="font-size: 13px; color: #94a3b8; margin-top: 8px;">
    If you did not request this, you can safely ignore this email.
  </p>
</div>

<!-- Footer -->
<div style="background: #1e293b; color: white; padding: 16px 30px; text-align: center; font-size: 12px; font-family: monospace;">
  &copy; ${new Date().getFullYear()} Brit Bangla Chambers. All rights reserved.
</div>

`;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};
