"use client";

import { useState, useEffect } from "react";

const FormBuilder = ({
  fields,
  onSubmit,
  submitText = "Submit",
  disabled = false,
  initialData = null,
}) => {

  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "file" ? null : "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData) {
      const populatedData = { ...initialFormState };
      Object.keys(populatedData).forEach((key) => {
        if (
          initialData[key] !== undefined &&
          key !== "serviceImage" &&
          key !== "image" &&
          key !== "profilePhoto"
        ) {
          populatedData[key] = initialData[key] || "";
        }
      });
      setFormData(populatedData);
    } else {
      setFormData(initialFormState);
    }
  }, [initialData, fields]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] : value,
    }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (disabled || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();

      // Add all form fields to FormData, including empty strings
      fields.forEach((field) => {
        const fieldValue = formData[field.name];
        if (field.type === "file") {
          // Only add file if one is selected
          if (fieldValue) {
            data.append(field.name, fieldValue);
          }
        } else {
          // Add text fields even if empty
          data.append(field.name, fieldValue || "");
        }
      });

      // ✅ Log to confirm FormData includes all fields
      for (const pair of data.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      const result = await onSubmit(data);

      // Reset form only if submission was successful and not editing
      if (result !== false && !initialData) {
        setFormData(initialFormState);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600 text-sm lg:text-base">
          Fill in the information below to {initialData ? "update" : "create"}{" "}
          the item
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                disabled={disabled || isSubmitting}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 transition-colors text-sm lg:text-base"
              >
                <option value="">-- Select {field.label} --</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                disabled={disabled || isSubmitting}
                rows="4"
                placeholder={field.placeholder || ""}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 transition-colors resize-none text-sm lg:text-base"
              />
            ) : field.type === "file" ? (
              <div className="space-y-3">
                {/* Show current image if editing */}
                {initialData?.serviceImage && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <img
                      src={initialData.serviceImage || "/placeholder.svg"}
                      alt="Current"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Current Image
                      </p>
                      <p className="text-xs text-blue-600">
                        Upload a new image to replace
                      </p>
                    </div>
                  </div>
                )}

                {/* Show current image for other file types */}
                {initialData?.image && field.name === "image" && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <img
                      src={initialData.image || "/placeholder.svg"}
                      alt="Current"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Current Image
                      </p>
                      <p className="text-xs text-blue-600">
                        Upload a new image to replace
                      </p>
                    </div>
                  </div>
                )}

                {/* Show current image for profile photos */}
                {initialData?.profile_photo_url &&
                  field.name === "profilePhoto" && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <img
                        src={
                          initialData.profile_photo_url || "/placeholder.svg"
                        }
                        alt="Current"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Current Image
                        </p>
                        <p className="text-xs text-blue-600">
                          Upload a new image to replace
                        </p>
                      </div>
                    </div>
                  )}

                <div className="relative">
                  <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    required={
                      field.required &&
                      !initialData?.serviceImage &&
                      !initialData?.image
                    }
                    disabled={disabled || isSubmitting}
                    accept={field.accept}
                    className="hidden"
                    id={field.name}
                  />
                  <label
                    htmlFor={field.name}
                    className="flex items-center justify-center w-full px-4 py-6 lg:py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    <div className="text-center">
                      <svg
                        className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400 mb-4"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-sm lg:text-base text-gray-600">
                        <span className="font-semibold text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                disabled={disabled || isSubmitting}
                placeholder={field.placeholder || ""}
                className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 transition-colors text-sm lg:text-base"
              />
            )}

            {field.type === "file" && formData[field.name] && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">
                    Selected: {formData[field.name]?.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="pt-4">
          <button
            type="submit"
            disabled={disabled || isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-sm lg:text-base"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;
