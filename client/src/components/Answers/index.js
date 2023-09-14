import React, { useState, useEffect, useContext } from "react";
import { AnswerContext } from "../../contexts/AnswerContext";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styled from "styled-components";
import { Button, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
const Container = styled.div`
  background-color: rgb(17, 24, 39);
  width: calc(100% - 20px);
  justify-content: flex-start !important;
  padding: 10px;
  overflow-x: scroll !important;
`;

const Answer = styled.div`
  background-color: rgb(31, 41, 55);
  border: none;
  padding: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const Box = styled.div`
  color: white !important;
  background-color: rgb(79, 70, 229);
  min-height: 22px;
  padding: 10px;
`;

const Ans = ({ answer, idx }) => {
  const { setAnswers } = useContext(AnswerContext);
  const [visibleMove, setVisibleMove] = useState(false);

  const handleMoveLeft = (idx) => {
    setAnswers((prev) => [
      ...prev.slice(0, idx - 1),
      prev[idx],
      prev[idx - 1],
      ...prev.slice(idx + 1),
    ]);
  };

  const handleMoveRight = (idx) => {
    setAnswers((prev) => [
      ...prev.slice(0, idx),
      prev[idx + 1],
      prev[idx],
      ...prev.slice(idx + 2),
    ]);
  };

  const handleDeleteAnswer = (ans) => {
    setAnswers((prev) => prev.filter((answer) => answer !== ans));
  };

  return (
    <Answer
      onMouseEnter={() => {
        setVisibleMove(true);
      }}
      onMouseLeave={() => {
        setVisibleMove(false);
      }}
    >
      {visibleMove && (
        <IconButton onClick={() => handleMoveLeft(idx)}>
          <KeyboardArrowLeftIcon color="error" />
        </IconButton>
      )}
      <Box>{answer.video}</Box>
      <Box>{answer.frameIdx}</Box>
      <IconButton onClick={() => handleDeleteAnswer(answer)}>
        <CloseIcon color="info" />
      </IconButton>
      {visibleMove && (
        <IconButton onClick={() => handleMoveRight(idx)}>
          <KeyboardArrowRightIcon color="error" />
        </IconButton>
      )}
    </Answer>
  );
};

const Answers = () => {
  const { answers } = useContext(AnswerContext);

  const handleDownload = () => {
    const csv = answers.map((d) => `${d.video},${d.frameIdx}`).join("\n");
    const data = new Blob([csv], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(data);
    a.download = "filename.csv";
    a.click();
  };

  return (
    <div
      style={{ width: "100%", justifyContent: "space-between", border: "none" }}
    >
      <Container>
        {answers.length > 0 &&
          answers.map((answer, idx) => (
            <Ans answer={answer} idx={idx} key={idx} />
          ))}
      </Container>
      <Button variant="contained" onClick={handleDownload}>
        CSV <DownloadIcon />
      </Button>
    </div>
  );
};

export default Answers;
