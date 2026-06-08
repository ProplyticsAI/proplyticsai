import type { BackgroundResponse, RuntimeRequest } from "./messages";

export async function sendToBackground<T>(message: RuntimeRequest): Promise<T> {
  const response = await chrome.runtime.sendMessage<
    RuntimeRequest,
    BackgroundResponse<T>
  >(message);

  if (!response?.ok) {
    throw new Error(response?.error || "Aktion konnte nicht ausgeführt werden.");
  }

  return response.data as T;
}
