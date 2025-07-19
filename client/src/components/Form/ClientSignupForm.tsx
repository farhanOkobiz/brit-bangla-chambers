"use client";

import { apiFetch } from "@/api/apiFetch";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientSignupForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nidNumber: "",
    dateOfBirth: "",
    gender: "",
    profilePhoto: "",
    presentAddress: "",
    permanentAddress: "",
    terms: false,
  });
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.terms) newErrors.terms = "You must accept the terms";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Only send fields required by backend (exclude confirmPassword and terms)
      const postData = { ...formData } as Partial<typeof formData>;
      delete postData.confirmPassword;
      delete postData.terms;
      try {
        const res = await apiFetch(`/auth/register`, {
          method: "POST",
          body: JSON.stringify(postData),
        });

        
          // Check for custom OTP status code
          if (res.status === 201) {
            const resOTP = await apiFetch(`/auth/send-otp`, {
              method: "POST",
              body: JSON.stringify({ email: postData.email }),
            });
            console.log("OTP send response:", resOTP);
           if (resOTP.status === 200) {
            return router.push(`/verify-otp?&email=${postData.email}`);      
           }
          }
           else {
            setErrors({ general: "Registration failed" });
            return;
          }
    
        // Registration success: you may want to redirect or show a message
        // For now, just clear the form
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          nidNumber: "",
          dateOfBirth: "",
          gender: "",
          profilePhoto: "",
          presentAddress: "",
          permanentAddress: "",
          terms: false,
        });
        setErrors({});
      } catch (err) {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto ">
      <h2 className="text-gray-700 text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-center">
        Register as Client
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            error={errors.full_name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+8801234567890"
            error={errors.phone}
          />
          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />

          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: "", label: "Select Gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />

          {/* <Input
            label="Profile Photo URL"
            name="profilePhoto"
            value={formData.profilePhoto}
            onChange={handleChange}
          /> */}
          <Input
            label="NID Number"
            name="nidNumber"
            value={formData.nidNumber}
            onChange={handleChange}
          /> 
          <Input
            label="Present Address"
            name="presentAddress"
            value={formData.presentAddress}
            onChange={handleChange}
          />
          
           <Input
            label="Permanent Address"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            id="terms"
            className="mr-2"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{" "}
            <a
              href="/terms"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </a>
          </label>
        </div>
        {errors.terms && <p className="text-red-600 text-sm">{errors.terms}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition cursor-pointer"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

// Reusable Input
function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`mt-1 w-full px-4 py-3 border rounded-md text-sm bg-white ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Reusable Select
function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
