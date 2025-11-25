import { apiClient } from "./client";

interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  size: number;
}

export async function uploadPaymentProof(
  orderId: string,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  const uploadResponse = await apiClient.post<UploadResponse>(
    "/upload/payment-proof",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  await apiClient.patch(`/orders/${orderId}/payment-proof`, {
    paymentProof: uploadResponse.data.url,
  });
}
