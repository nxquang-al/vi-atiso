import React, { useState, createContext, useMemo } from "react";

const APIContext = createContext(null);

const APIProvider = ({ children }) => {
  const [apis, setApis] = useState([
    { name: "BEiT-3", url: "http://localhost:7865" },
    { name: "CLIP", url: "http://localhost:8000" },
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
