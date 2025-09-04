import { axiosInstance, handleApiError } from "../axiosInstance";

export const fetchAdminImages = async (params) => {
  try {
    const { data } = await axiosInstance.get("/admin/images", { params });
    return data?.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Bulk update statuses
export const bulkUpdateImageStatus = async (ids, status) => {
  try {
    const { data } = await axiosInstance.patch("/admin/images", {
      ids,
      status,
    });
    return data?.data; // { ids, status }
  } catch (error) {
    handleApiError(error);
  }
};

// Bulk delete
export const bulkDeleteImages = async (ids) => {
  try {
    const { data } = await axiosInstance.delete("/admin/images", {
      ids,
    });
    return data?.data; // { ids }
  } catch (error) {
    handleApiError(error);
  }
};

// Analytics
export const fetchImageAnalytics = async () => {
  try {
    const { data } = await axiosInstance.get("/admin/images/analytics");
    return data?.data; // analytics object
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch single image by ID
export const fetchImageById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/admin/images/${id}`);
    return data?.data; // single image
  } catch (error) {
    handleApiError(error);
  }
};

// Update status of a single image
export const updateImageStatus = async (id, status) => {
  try {
    const { data } = await axiosInstance.put(`/admin/images/${id}`, { status });
    return data?.data; // updated image
  } catch (error) {
    handleApiError(error);
  }
};

// Permanently delete one image
export const deleteImagePermanently = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/admin/images/${id}`);
    return data?.data;
  } catch (error) {
    handleApiError(error);
  }
};
