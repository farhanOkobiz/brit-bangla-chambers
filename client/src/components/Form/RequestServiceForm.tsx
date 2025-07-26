import { apiFetch } from "@/api/apiFetch";
import { useGetAuthQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface item {
  _id: number;
  name: string;
}

function RequestServiceForm() {
  const [specialization, setSpecialization] = useState([]);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    nid: "",
    presentAddress: "",
    permanentAddress: "",
    issueType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiFetch("/request-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: form,
        }),
      });

      if (!response.ok) {
        toast.warning("Failed to submit");
        return;
      }

      toast.success("Request sent successfully!");
      console.log("ok");

      setForm({
        name: "",
        email: "",
        phone: "",
        nid: "",
        presentAddress: "",
        permanentAddress: "",
        issueType: "",
        message: "",
      });
      router.push("/");
    } catch {
      toast.warning("Error submitting the form. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchSpecialization() {
      const res = await apiFetch("/specialization/get-all-specialization");
      setSpecialization(res?.data);
    }

    fetchSpecialization();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Email */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            required
          />
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>

        {/* Phone & NID */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          <Input
            name="nid"
            type="text"
            value={form.nid}
            onChange={handleChange}
            placeholder="NID Card Number"
            required
          />
        </div>

        {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            name="presentAddress"
            type="text"
            value={form.presentAddress}
            onChange={handleChange}
            placeholder="Present Address"
            required
          />
          <Input
            name="permanentAddress"
            type="text"
            value={form.permanentAddress}
            onChange={handleChange}
            placeholder="Permanent Address"
            required
          />
        </div>

        {/* Issue Type */}
        <div>
          <label
            htmlFor="issueType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Issue Type
          </label>
          <select
            name="issueType"
            value={form.issueType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
          >
            <option value="">Select Issue Type</option>
            {specialization?.map((item: item) => (
              <option key={item?._id} value={item?.name}>
                {item?.name}
              </option>
            ))}
            <option value="idonotknow">I do not know</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Describe the Issue
          </label>
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Your message here..."
            required
            className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-[#5e3030] text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-200 hover:text-gray-900 transition cursor-pointer"
        >
          Request
        </button>
      </form>
    </div>
  );
}

function Input({
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}: {
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1 capitalize"
      >
        {name.replace(/([A-Z])/g, " $1")}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
      />
    </div>
  );
}

export default RequestServiceForm;
