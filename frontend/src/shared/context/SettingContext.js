import React, { createContext, useState, useEffect } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { API_ENDPOINTS } from '../util/apiConfig';

export const SettingsContext = createContext({
  settings: null,
  setSettings: () => {},
});

export const SettingsProvider = ({ children }) => {
  const { sendRequest } = useHttpClient();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const responseData = await sendRequest(API_ENDPOINTS.GET_SETTINGS);
        setSettings(responseData.settings);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [sendRequest]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
