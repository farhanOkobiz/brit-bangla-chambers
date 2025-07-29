import React from "react";

const UserVerifyButton = ({ user, onVerify }) => (
  <button
    onClick={() => onVerify(user)}
    className={`px-4 py-2 rounded ${user.otp_verified ? "bg-green-400" : "bg-yellow-400"} text-white`}
    disabled={user.otp_verified}
  >
    {user.otp_verified ? "Verified" : "Verify"}
  </button>
);

export default UserVerifyButton;
