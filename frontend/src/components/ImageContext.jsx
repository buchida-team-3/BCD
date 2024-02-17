// Context API를 위한 파일

import React, { createContext, useState, useContext } from 'react';

const ImageDataContext = createContext();

export const useImageData = () => useContext(ImageDataContext);

export const ImageDataProvider = ({ children }) => {
  const [ imageData, setImageData ] = useState([]);

  const value = {
    imageData,
    setImageData,
  };

  return <ImageDataContext.Provider value={value}>{children}</ImageDataContext.Provider>;
};
