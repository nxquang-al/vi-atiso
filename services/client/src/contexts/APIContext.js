import React, { useState, createContext, useMemo } from "react";

const APIContext = createContext(null);

const APIProvider = ({ children }) => {
  const [apis, setApis] = useState([
    {
      name: "BEiT-3",
      url: "https://nxquang-al-atiso-beit3-full-api.hf.space/retrieval",
    },
    {
      name: "CLIP",
      url: "https://nxquang-al-atiso-clip-full-api.hf.space/retrieval",
    },
    {
      name: "OCR-exact",
      url: `${process.env.REACT_APP_OCR_VM_IP}/search/exact`,
    },
    {
      name: "OCR-fuzzy",
      url: `${process.env.REACT_APP_OCR_VM_IP}/search/fuzzy`,
    },
    {
      name: "CLIP2Video",
      url: "https://nxquang-al-atiso-clip2video.hf.space/retrieval",
    },
    {
      name: "ObjectSearch",
      url: "https://nxquang-al-atiso-object-search.hf.space/search",
    },
  ]);

  const value = useMemo(() => ({
    apis,
    setApis,
  }));

  return (
    <APIContext.Provider value={value} style={{ border: "none" }}>
      {children}
    </APIContext.Provider>
  );
};

export { APIContext, APIProvider };
