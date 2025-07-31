import { apiFetch } from "@/api/apiFetch";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedService } from "@/redux/slices/selectedServiceSlice";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";

type FormData = {
  name: string;
  email: string;
  phone: string;
  nid: string;
  presentAddress: string;
  permanentAddress: string;
  issueType: string;
  message: string;
};

interface item {
  _id: number;
  name: string;
}

function RequestServiceForm() {
  const [specialization, setSpecialization] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedService = useSelector(
    (state: RootState) => state.selectedService
  );
  const [attachments, setAttachments] = useState<FileList | null>(null);

  // Hydrate Redux from localStorage if empty
  React.useEffect(() => {
    console.log("Selected service:", selectedService);
    if (!selectedService?.id) {
      const stored = localStorage.getItem("selectedService");
      console.log("Stored service:", stored);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          dispatch({
            type: "selectedService/setSelectedService",
            payload: parsed,
          });
        } catch {}
      }
    }
  }, [selectedService, dispatch]);

  // Use localStorage for initial form state if Redux is empty
  const getInitialIssueType = () => {
    if (selectedService?.name) return selectedService.name;
    const stored = localStorage.getItem("selectedService");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.name || "";
      } catch {}
    }
    return "";
  };

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    nid: "",
    presentAddress: "",
    permanentAddress: "",
    issueType: getInitialIssueType(),
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
      const formData = new FormData();

      formData.append("userMessage", JSON.stringify(form));

      let serviceId = selectedService?.id;
      if (!serviceId) {
        const stored = localStorage.getItem("selectedService");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            serviceId = parsed.id;
          } catch {}
        }
      }
      if (serviceId) {
        formData.append("serviceId", serviceId);
      }

      if (attachments && attachments.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
          formData.append("attachments", attachments[i]);
        }
      }

      const response = await apiFetch("/request-service", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.warning("Failed to submit");
        return;
      }
      console.log("Form submitted successfully:", response.data);
      toast.success("Request sent successfully!");
      dispatch(clearSelectedService());
      localStorage.removeItem("selectedService");
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
      setAttachments(null);
      router.push("/");
    } catch {
      toast.warning("Error submitting the form. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments(e.target.files);
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

        <div>
          <label
            htmlFor="issueType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Specilization
          </label>
          <select
            name="issueType"
            value={form.issueType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-md text-gray-800"
            disabled={!!selectedService?.name}
          >
            <option value="">Select Specialization</option>
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

        <div>
          <label
            htmlFor="attachments"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Attach PDF documents (optional)
          </label>
          <input
            type="file"
            name="attachments"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-md text-gray-800"
          />
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
