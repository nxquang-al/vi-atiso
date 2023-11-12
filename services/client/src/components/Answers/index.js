import React, { useState, useContext } from "react";
import { AnswerContext } from "../../contexts/AnswerContext";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styled from "styled-components";
import { Button, IconButton } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import Dres from "../Dres";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
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
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (answers.length > 0) {
      setIsLoading(true);
      const { video, frameIdx } = answers[0];

      if (video && frameIdx) {
        const { data } = await axios.get(
          `https://eventretrieval.one/api/v1/submit?item=${video}&frame=${frameIdx}&session=${sessionId}`
        );

        // console.log(data);
        alert(JSON.stringify(data, undefined, 4));
        setStatus(data.submission);
      }
      setIsLoading(false);
    }
  };

  const parseStatusToColor = () => {
    if (status === "") {
      return "primary";
    }

    if (status === "true" || status === "TRUE") {
      return "success";
    }

    if (status === "WRONG") {
      return "error";
    }
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
      <Dres sessionId={sessionId} setSessionId={setSessionId} />
      <Button
        variant="contained"
        onClick={handleSubmit}
        color={parseStatusToColor()}
        endIcon={isLoading ? <CircularProgress /> : <UploadIcon />}
        disabled={answers.length === 0}
      >
        Submit
      </Button>
    </div>
  );
};

export default Answers;
