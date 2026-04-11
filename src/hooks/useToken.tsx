import { useState } from 'react';


// Define the type for the userToken object
interface UserToken {
  token: string | null;
}

// Define the return type for the hook
interface UseToken {
  setToken: (userToken: UserToken) => void;
  token: string | null;
}

/** Match axios + authSlice: primary source is loggedInUser JSON. */
function readTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem("loggedInUser");
    if (raw) {
      const u = JSON.parse(raw) as { token?: string };
      if (typeof u?.token === "string" && u.token.length > 0) return u.token;
    }
  } catch {
    /* ignore */
  }
  try {
    const tokenString = localStorage.getItem("token");
    if (!tokenString) return null;
    const parsed = JSON.parse(tokenString) as { token?: string };
    if (typeof parsed?.token === "string" && parsed.token.length > 0) return parsed.token;
  } catch {
    /* legacy non-JSON */
  }
  return null;
}

export default function useToken(): UseToken {
  const [token, setTokenState] = useState<string | null>(() =>
    readTokenFromStorage()
  );

  const saveToken = (userToken: UserToken): void => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setTokenState(userToken.token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
