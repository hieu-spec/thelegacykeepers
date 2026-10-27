// src/utils/mediaUpload.ts

/**
 * Chuyển đổi file ảnh/âm thanh thành chuỗi DataURL đã nén (tránh tràn bộ nhớ và không bị mất khi F5)
 * Nếu có cấu hình NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, tự động upload lên Cloudinary.
 */
export async function processAndUploadMedia(
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // 1. Nếu đã cấu hình Cloudinary -> Upload lên đám mây
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const resourceType = file.type.startsWith('audio/') ? 'video' : 'image';
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: 'POST', body: formData }
      );
      if (res.ok) {
        const data = await res.json();
        return data.secure_url as string;
      }
    } catch (e) {
      console.warn('Upload Cloudinary thất bại, chuyển về lưu trữ Base64 cục bộ:', e);
    }
  }

  // 2. Fallback bền vững: Nén ảnh qua Canvas và xuất ra Base64 DataURL (Không dùng URL.createObjectURL)
  if (file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = Math.min(1, maxWidth / (img.width || 1));
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/webp', quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Đối với file âm thanh nhỏ: đọc sang DataURL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
