import React, { useState, useEffect, useContext } from "react";

import { TextField, Button } from "@mui/material";
import styled from "styled-components";

// import Results from "../../components/Result";
import Answers from "../../components/Answers";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { APIContext } from "../../contexts/APIContext";
import ListAPI from "../../components/ListAPI";

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

const Home = ({ children }) => {
  function useNavigateParams() {
    const navigate = useNavigate();

    return (url, params) => {
      const searchParams = createSearchParams(params).toString();
      navigate(url + "?" + searchParams);
    };
  }

  const navigateParams = useNavigateParams();
  const { pathname, search } = useLocation();

  const [query, setQuery] = useState(
    new URLSearchParams(search).get("query") ||
      "People skiing, snowboarding, playing with kids on a snowy mountain. The sky is snowing, foggy, white, barely see anything other than snow"
  );
  const [topK, setTopK] = useState(
    new URLSearchParams(search).get("topK") || 10
  );

  const { apis } = useContext(APIContext);

  const onClear = () => {
    setQuery("");
    setTopK(3);
  };

  const handleTopK = (e) => {
    switch (e.keyCode) {
      case 38:
        setTopK((prev) => parseInt(prev) + 1);
        break;
      case 40:
        setTopK((prev) => parseInt(prev) - 1);
        break;
      default:
        console.log("Invalid key", e.keyCode);
    }
  };

  const onSubmit = () => {
    document.title = "Atiso-" + apis[0].name;

    navigateParams(apis[0].name, {
      query,
      topK,
      modelUrl: apis[0].url,
    });
  };

  useEffect(() => {}, []);

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
              required
            />
            <TextField
              placeholder="Top"
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
              type="number"
              required
              onKeyDown={handleTopK}
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
      <ListAPI />
      {children}
    </div>
  );
};

export default Home;
