// src/components/FormBuilder.jsx
import { useState } from "react";

const FormBuilder = ({ fields, onSubmit, submitText = "Submit" }) => {
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "file" ? null : "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    fields.forEach((field) => {
      if (formData[field.name]) {
        data.append(field.name, formData[field.name]);
      }
    });

    await onSubmit(data);
    setFormData(initialFormState); // Reset form
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Create New</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="font-semibold mb-1 text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full px-4 py-2 border rounded focus:outline-none"
              >
                <option value="">-- Select --</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                rows="4"
                placeholder={field.placeholder || ""}
                className="w-full px-4 py-2 border rounded focus:outline-none"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={field.type === "file" ? undefined : formData[field.name]}
                onChange={handleChange}
                required={field.required}
                accept={field.accept}
                placeholder={field.placeholder || ""}
                className="w-full px-4 py-2 border rounded focus:outline-none"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default FormBuilder;
