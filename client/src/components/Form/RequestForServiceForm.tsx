import { apiFetch } from "@/api/apiFetch";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedService } from "@/redux/slices/selectedServiceSlice";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";
import FormDataForRequestService from "@/types/requestForService";

interface item {
  _id: number;
  name: string;
}

function RequestForServiceForm() {
  const [specialization, setSpecialization] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedService = useSelector(
    (state: RootState) => state.selectedService
  );
  const [attachments, setAttachments] = useState<FileList | null>(null);

  // Hydrate Redux from localStorage if empty
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (!selectedService?.id) {
        const stored = localStorage.getItem("selectedService");
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
    }
  }, [selectedService, dispatch]);

  // Use localStorage for initial form state if Redux is empty
  const getInitialIssueType = () => {
    if (selectedService?.name) return selectedService.name;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedService");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.name || "";
        } catch {}
      }
    }
    return "";
  };

  const [form, setForm] = useState<FormDataForRequestService>({
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
      if (!serviceId && typeof window !== "undefined") {
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
      toast.success("Request sent successfully!");
      dispatch(clearSelectedService());
      if (typeof window !== "undefined") {
        localStorage.removeItem("selectedService");
      }
      setForm({
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

        <div className="w-full">
          {/* Change Service Button */}
          {selectedService?.name && (
            <button
              type="button"
              className="mb-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              onClick={() => {
                dispatch(clearSelectedService());
                if (typeof window !== "undefined") {
                  localStorage.removeItem("selectedService");
                }
                setForm((prev) => ({ ...prev, issueType: "" }));
              }}
            >
              Change Service
            </button>
          )}
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
            <option value="i do not know">I do not know</option>
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

export default RequestForServiceForm;
