'use client';
import { createContext, useContext, useState } from 'react';

const FilesContext = createContext();
export const useFiles = () => useContext(FilesContext);

export const FilesProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  
  const handleBack = () => {
    setFiles([]);
    window.location.href = '/'; // Simple hard redirect for now, or router.push
  };

  return (
    <FilesContext.Provider value={{ files, setFiles, handleBack }}>
      {children}
    </FilesContext.Provider>
  );
};
