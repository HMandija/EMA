/**
 * Compress an image file before uploading to Cloudinary.
 * Resizes to max 2000px width and converts to JPEG at 85% quality.
 * This keeps files well under Cloudinary's 10MB limit.
 */
export const compressImage = (file, maxWidth = 2000, quality = 0.85) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
          });
          resolve(compressed);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback: use original
    };

    img.src = url;
  });
};

/**
 * Upload a single image to Cloudinary (with compression).
 */
export const uploadToCloudinary = async (file, folder = "ema-architecture") => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const compressed = await compressImage(file);

  const fd = new FormData();
  fd.append("file", compressed);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: fd }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
};

/**
 * Upload multiple images with progress callback.
 */
export const uploadMultiple = async (files, folder, onProgress) => {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadToCloudinary(files[i], folder);
    urls.push(url);
    onProgress?.(i + 1, files.length);
  }
  return urls;
};
