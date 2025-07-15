"use client";
import { useState } from "react";

export default function AdvocateSignupForm() {
  const [formData, setFormData] = useState({
    role: "advocate",
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nidNumber: "",
    nidPicture: "",
    barCouncilId: "",
    barCouncilCertificate: "",
    profilePhoto: "",
    chamberAddress: "",
    presentAddress: "",
    permanentAddress: "",
    expertise: "",
    qualification: "",
    experienceYears: "",
    gender: "",
    dateOfBirth: "",
    languages: "",
    linkedin: "",
    facebook: "",
    website: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Advocate Signup Data:", formData);
  };

  return (
    <div className="max-w-3xl mx-auto ">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Register as Advocate
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid Form */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Input
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
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
          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <Input
            label="NID Number"
            name="nidNumber"
            value={formData.nidNumber}
            onChange={handleChange}
          />
          <Input
            label="NID Picture URL"
            name="nidPicture"
            value={formData.nidPicture}
            onChange={handleChange}
          />
          <Input
            label="Bar Council ID"
            name="barCouncilId"
            value={formData.barCouncilId}
            onChange={handleChange}
          />
          <Input
            label="Bar Council Certificate"
            name="barCouncilCertificate"
            value={formData.barCouncilCertificate}
            onChange={handleChange}
          />
          <Input
            label="Profile Photo URL"
            name="profilePhoto"
            value={formData.profilePhoto}
            onChange={handleChange}
          />
          <Input
            label="Qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
          />
          <Input
            label="Years of Experience"
            name="experienceYears"
            type="number"
            value={formData.experienceYears}
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
          <Input
            label="Chamber Address"
            name="chamberAddress"
            value={formData.chamberAddress}
            onChange={handleChange}
          />
          <Input
            label="Languages Spoken"
            name="languages"
            value={formData.languages}
            onChange={handleChange}
          />
          <Input
            label="LinkedIn Profile"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
          />
          <Input
            label="Facebook Profile"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
          />
          <Input
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        {/* TextArea Outside Grid */}
        <TextArea
          label="Expertise Areas"
          name="expertise"
          value={formData.expertise}
          onChange={handleChange}
          placeholder="e.g. Criminal Law, Family Law"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
        >
          Register as Advocate
        </button>
      </form>
    </div>
  );
}

// Input Component
function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
}: any) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
      />
    </div>
  );
}

// TextArea Component
function TextArea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = "",
}: any) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
      ></textarea>
    </div>
  );
}

// Select Component
function Select({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}: any) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
      >
        {options.map(({ value: val, label: lbl }: any) => (
          <option key={val} value={val}>
            {lbl}
          </option>
        ))}
      </select>
    </div>
  );
}
