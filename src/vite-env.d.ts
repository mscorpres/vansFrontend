/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REACT_APP_SOCKET_BASE_URL: string;
    readonly VITE_REACT_APP_API_BASE_URL: string;
    // Add other environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  