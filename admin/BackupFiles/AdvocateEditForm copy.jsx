import React from "react";
import FormModal from "../components/common/FormModal";

const AdvocateEditForm = ({ advocate, onCancel, fields, isLoading, handleSubmit }) => (
  <FormModal
    title="Edit Advocate"
    fields={fields}
    onSubmit={handleSubmit}
    isLoading={isLoading}
    editingItem={advocate}
    onCancel={onCancel}
    showForm={!!advocate}
    onToggleForm={onCancel}
    buttonText="Update Advocate"
    modalClassName="min-h-[1000px]"
  />
);

export default AdvocateEditForm;
