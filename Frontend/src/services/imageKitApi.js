import api from "./api";

export const uploadImageKitApi = async (file, onProgress) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post("/imagekit/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },

    onUploadProgress: (event) => {
      if (event.total && event.total > 0 && typeof onProgress === "function") {
        const progress = Math.round((event.loaded / event.total) * 100);

        onProgress(progress);
      }
    },
  });

  return response.data;
};
