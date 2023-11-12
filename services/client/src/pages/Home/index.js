import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

// import Results from "../../components/Result";
import Answers from "../../components/Answers";
import ListAPI from "../../components/ListAPI";
import InputGroup from "../../components/Input";

import { APIContext } from "../../contexts/APIContext";
import { useNavigateParams } from "../../hooks/useNavigateParams";

const Home = ({ children }) => {
  const { apis } = useContext(APIContext);

  const navigateParams = useNavigateParams();
  const { pathname, search } = useLocation();

  const [query, setQuery] = useState(
    new URLSearchParams(search).get("query") || ""
  );
  const [topK, setTopK] = useState(
    new URLSearchParams(search).get("topK") || 10
  );

  useEffect(() => {
    const dump = apis.filter((api) => api.name === pathname.slice(1))[0];
    if (dump) {
      document.title = "Atiso-" + dump.name;
      navigateParams(dump.name, {
        query,
        topK,
        modelUrl: dump.url,
      });
    }
  }, [apis]);

  return (
    <div
      style={{
        flexDirection: "column",
        border: "none",
        maxWidth: "90vw",
      }}
    >
      <div
        style={{
          width: "100%",
          border: "none",
          flexDirection: "column",
        }}
      >
        <InputGroup
          query={query}
          setQuery={setQuery}
          topK={topK}
          setTopK={setTopK}
        />
      </div>
      <Answers />
      <ListAPI />
      {children}
    </div>
  );
};

export default Home;
