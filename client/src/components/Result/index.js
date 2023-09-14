import React from "react";

import Result from "./result";

// const ConsoleBucketUrl = `https://console.cloud.google.com/storage/browser/_details/thangtd1`;

const Results = ({ results }) => {
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
          />
        ))}
    </div>
  );
};

export default Results;
