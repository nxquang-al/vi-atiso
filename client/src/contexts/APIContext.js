import React, { useState, createContext, useMemo } from "react";

const APIContext = createContext(null);

const APIProvider = ({ children }) => {
  const [apis, setApis] = useState([
    {
      name: "BEiT-3",
      url: "https://nxquang-al-atiso-beit3.hf.space/retrieval",
    },
    { name: "CLIP", url: "https://nxquang-al-atiso-clip.hf.space/retrieval" },
    {
      name: "CLIP2Video",
      url: "https://nxquang-al-atiso-clip2video.hf.space/retrieval",
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
