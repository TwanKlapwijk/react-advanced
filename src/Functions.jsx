export function formatDate(timestampStr) {
  const timestamp = new Date(timestampStr);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return new Intl.DateTimeFormat("nl-NL", options).format(timestamp);
}

export const handleChange = (e, formData, setFormData) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

export const handleUserChange = (userId, formData, setFormData) => {
  setFormData({ ...formData, createdBy: userId });
};

export const handleCheckboxChange = (categoryId, formData, setFormData) => {
  const updatedCategoryIds = formData.categoryIds.includes(categoryId)
    ? formData.categoryIds.filter((id) => id !== categoryId)
    : [...formData.categoryIds, categoryId];

  setFormData({ ...formData, categoryIds: updatedCategoryIds });
};
