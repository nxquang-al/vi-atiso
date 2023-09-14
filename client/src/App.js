import React, { useState, useEffect } from "react";

import { TextField, Button } from "@mui/material";
import styled from "styled-components";

import axios from "axios";
import Results from "./components/Result";
import { AnswerProvider } from "./contexts/AnswerContext";
import Answers from "./components/Answers";

const InputFile = styled.div`
  &:hover {
    cursor: pointer;
  }
  background-color: rgb(31, 41, 55);
  height: 240px;
  width: 100%;
  min-width: min(160px, 100%);
  border-style: dashed !important;
  border-color: rgb(55, 65, 81) !important;
  border-width: 3px !important;
  border-radius: 10px !important;
  flex-direction: column !important;
`;
const InputText = styled.div`
  width: calc(100% - 20px);
  background-color: rgb(31, 41, 55);
  padding: 10px;
  color: "#c4c4c4";
  margin: 10px;
  display: grid !important;
  grid-template-columns: 9fr 1fr;
  gap: 10px;
`;

const OrSpan = styled.span`
  color: #9ca3af;
  line-height: 1.5;
`;

const App = () => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(3);
  const [results, setResults] = useState([
    {
      video: "L01_V011",
      frame_name: "0129.jpg",
      distance: "1.4808606",
    },
    {
      video: "L01_V029",
      frame_name: "0122.jpg",
      distance: "1.4832553",
    },
    {
      video: "L01_V026",
      frame_name: "0223.jpg",
      distance: "1.4840636",
    },
  ]);

  const onClear = () => {
    setQuery("");
    setTopK(3);
    setResults([]);
  };

  const onSubmit = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_ENDPOINT}/retrieval/image-text`,
      {
        query_text: query,
        topk: topK,
      }
    );

    console.log(data);

    if (data.message === "success") {
      setResults(data.details);

      // data.details.forEach(async (detail) => {
      //   console.log(detail);

      //   const { data } = await axios.get(
      //     `${process.env.REACT_APP_API_ENDPOINT}/stream_video/thangtd1/${detail.video}.mp4`
      //   );

      //   console.log(data);

      //   if (data.url !== "") {
      //     setResults((prev) => [...prev, data.url]);
      //   }

      //   // .then((response) => {
      //   //   const videoBlob = new Blob([response.data], { type: "video/mp4" });
      //   //   const videoObjectURL = URL.createObjectURL(videoBlob);
      //   //   console.log(videoObjectURL);
      //   //   setResults((prev) => [...prev, videoObjectURL]);
      //   // })
      //   // .catch((error) => {
      //   //   console.error("Error fetching video:", error);
      //   // });
      // });
    }
  };

  useEffect(() => {}, []);

  return (
    <div
      style={{
        flexDirection: "column",
        border: "none",
        maxWidth: "90vw",
      }}
    >
      <AnswerProvider>
        <div
          style={{
            width: "100%",
            border: "none",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "50vw",
              border: "none",
              flexDirection: "column",
            }}
          >
            <InputFile>
              Drop File Here
              <OrSpan>Or</OrSpan>
              Clip to Upload
            </InputFile>
            <p>Or</p>
            <InputText>
              <TextField
                placeholder="English Query"
                multiline={true}
                sx={{
                  backgroundColor: "rgb(55, 65, 81)",
                  borderRadius: "5px",
                  boxShadow: "rgba(0, 0, 0, 0.1)",
                  textarea: { color: "#c4c4c4" },
                }}
                variant="outlined"
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <TextField
                placeholder="Top K"
                multiline={true}
                sx={{
                  backgroundColor: "rgb(55, 65, 81)",
                  borderRadius: "5px",
                  boxShadow: "rgba(0, 0, 0, 0.1)",
                  textarea: { color: "#c4c4c4", textAlign: "center" },
                }}
                variant="outlined"
                fullWidth
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
              />
            </InputText>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: 20,
                width: "100%",
                border: "none",
                margin: "10px 0",
              }}
            >
              <Button fullWidth onClick={onClear}>
                Clear
              </Button>
              <Button fullWidth variant="contained" onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
        <Answers />
        <Results results={results} />
      </AnswerProvider>
    </div>
  );
};

export default App;
