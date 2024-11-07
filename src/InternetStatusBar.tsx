import React, { useState, useEffect } from 'react';

const InternetStatusBar: React.FC = () => {
    const [alert, setAlert] = useState(false);
    
    useEffect(() => {
      const handleOffline = () => {
        setAlert(true);
      };
  
      const handleOnline = () => {
        setAlert(false);
      };
  
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
  
      return () => {
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('online', handleOnline);
      };
    }, []);
    
    return (
      <div>
        {alert && (
          <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center p-2 z-50">
            <strong>Internet connection lost. Please check your network.</strong>
          </div>
        )}
      </div>
    );
  };
  

export default InternetStatusBar;
