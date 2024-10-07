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

export default function useToken(): UseToken {
  
  const getToken = (): string | null => {
    const tokenString = localStorage.getItem('token');
   
    if (!tokenString) {
      
      return null
    };
    const userToken: UserToken = {token:tokenString}
    return userToken?.token || null;
  };

  const [token, setToken] = useState<string | null>(getToken());

  const saveToken = (userToken: UserToken): void => { 
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
    
  };

  return {
    setToken: saveToken,
    token
  };
}
