"use client";
import { FaPlus, FaTimes } from "react-icons/fa";
import FormBuilder from "./FormBuilder";

const FormModal = ({
  title,
  fields,
  onSubmit,
  isLoading = false,
  editingItem = null,
  onCancel,
  showForm = false,
  onToggleForm,
  buttonText = "Add Item",
}) => {
  const handleSubmit = async (formData) => {
    await onSubmit(formData);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (onToggleForm) onToggleForm();
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="mb-6">
        <button
          onClick={onToggleForm}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base font-medium"
        >
          <FaPlus className="h-4 w-4" />
          <span>{showForm ? "Hide Form" : buttonText}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              {editingItem ? `Edit ${title}` : `Create New ${title}`}
            </h2>
            {editingItem && (
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center space-x-1 self-start sm:self-auto"
              >
                <FaTimes className="h-4 w-4" />
                <span>Cancel Edit</span>
              </button>
            )}
          </div>
          <FormBuilder
            fields={fields}
            onSubmit={handleSubmit}
            submitText={
              isLoading
                ? editingItem
                  ? "Updating..."
                  : "Creating..."
                : editingItem
                ? `Update ${title}`
                : `Create ${title}`
            }
            disabled={isLoading}
            initialData={editingItem}
          />
        </div>
      )}
    </>
  );
};

export default FormModal;
