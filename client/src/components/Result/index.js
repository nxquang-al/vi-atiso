import React, { useContext, useEffect, useState } from "react";

import Result from "./result";
import axios from "axios";
import { useLocation } from "react-router-dom";

// const ConsoleBucketUrl = `https://console.cloud.google.com/storage/browser/_details/thangtd1`;

const Results = () => {
  const { pathname, search } = useLocation();
  const [results, setResults] = useState([]);

  const topK = new URLSearchParams(search).get("topK");
  const query = new URLSearchParams(search).get("query");
  const modelUrl = new URLSearchParams(search).get("modelUrl");

  useEffect(() => {
    const fetchAPIModel = async () => {
      const { data } = await axios.post(`${modelUrl}/retrieval/image-text`, {
        query_text: query,
        topk: topK,
      });

      if (data.message === "success") {
        setResults(data.details);
      }
    };

    fetchAPIModel();
  }, [pathname, search]);

  return (
    <div
      style={{
        flexDirection: "column",
        border: "none",
        alignItems: "flex-start",
        maxWidth: "100%",
      }}
    >
      {results.length > 0 &&
        results.map((result, idx) => (
          <Result
            result={result}
            key={result.video + result.frame_name + idx}
            top={idx + 1}
          />
        ))}
    </div>
  );
};

export default Results;
