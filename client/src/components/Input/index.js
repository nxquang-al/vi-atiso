import React, { useState, useEffect, useContext, useRef } from "react";
import { TextField, Button } from "@mui/material";
import styled from "styled-components";
import Paraphase from "../../components/Paraphase";
import { useNavigateParams } from "../../hooks/useNavigateParams";
import { APIContext } from "../../contexts/APIContext";

const InputFile = styled.div`
  background-color: rgb(31, 41, 55);
  height: 220px;
  width: 100%;
  min-width: min(160px, 100%);
  border-style: dashed !important;
  border-color: rgb(55, 65, 81) !important;
  border-width: 3px !important;
  border-radius: 10px !important;
  flex-direction: column !important;
  overflow-x: scroll !important;
  padding: 10px;
  gap: 10px;
  justify-content: flex-start !important;
  margin: 10px;
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

const InputCustom = ({ query, setQuery, topK, setTopK, handleTopK }) => {
  return (
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
  );
};

const InputGroup = ({ query, setQuery, topK, setTopK }) => {
  const [height, setHeight] = useState(200);
  const [maxOutput, setMaxOutput] = useState(10);
  const [defaultPrompt, setDefaultPrompt] = useState(
    process.env.REACT_APP_DEFAULT_PROMPT || ""
  );

  const dumpRef = useRef(null);
  const { apis } = useContext(APIContext);
  const navigateParams = useNavigateParams();

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

  useEffect(() => {
    if (dumpRef && dumpRef.current) {
      setHeight(dumpRef.current.offsetHeight);
    }
  }, []);

  return (
    <div
      style={{
        width: "50vw",
        border: "none",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          border: "none",
          width: "80vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 50,
        }}
      >
        <InputFile
          style={{
            height: height,
          }}
        >
          <Paraphase
            defaultPrompt={defaultPrompt}
            maxOutput={maxOutput}
            setQuery={setQuery}
          />
        </InputFile>
        <div style={{ flexDirection: "column", border: "none" }} ref={dumpRef}>
          <InputCustom
            query={defaultPrompt}
            setQuery={setDefaultPrompt}
            topK={maxOutput}
            setTopK={setMaxOutput}
            handleTopK={handleTopK}
          />
          <InputCustom
            query={query}
            setQuery={setQuery}
            topK={topK}
            setTopK={setTopK}
            handleTopK={handleTopK}
          />
        </div>
      </div>
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
  );
};

export default InputGroup;
