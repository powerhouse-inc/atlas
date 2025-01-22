declare global {
  interface Window {
    env?: {
      PH_CONNECT_ATLAS_BASE_URL?: string;
    };
  }
}

export const baseUrl =
  window.env?.PH_CONNECT_ATLAS_BASE_URL ?? window.location.href;
