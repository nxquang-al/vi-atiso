import { Button } from "@mui/material";
import React, { useContext } from "react";

import styled from "styled-components";
import { AnswerContext } from "../../contexts/AnswerContext";

const InfoContainer = styled.div`
  border-radius: 8px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  border: none;
  padding: 10px;
  background-color: rgb(17, 24, 39);
`;

const Box = styled.div`
  background-color: rgb(31, 41, 55);
  width: 100%;
  height: 100%;
  max-height: 160px;
  overflow-y: scroll;
  overflow-x: hidden;
  justify-content: space-around !important;
  padding: 10px;
  flex-direction: column;
`;

const Row = styled.div`
  background-color: rgb(55, 65, 81);
  width: calc(100% - 20px);
  min-height: 22px;
  padding: 10px;
`;

const Info = ({
  children,
  frameIdx,
  video,
  metadata,
  timeStart,
  timeEnd,
  disabled,
}) => {
  const videoUrl =
    timeStart === 0
      ? metadata.watch_url
      : metadata.watch_url + "&t=" + timeStart + "s";

  const { answers, setAnswers } = useContext(AnswerContext);

  const handleSelectAnswer = () => {
    setAnswers((prev) => [...prev, { video, frameIdx }]);
  };

  return (
    <InfoContainer>
      {children}
      <Box>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            columnGap: 10,
            width: "100%",
            border: "none",
          }}
        >
          <Row style={{ backgroundColor: "rgb(79, 70, 229)", color: "white" }}>
            Video
          </Row>
          <Row>{video}</Row>
          <Row style={{ backgroundColor: "rgb(79, 70, 229)", color: "white" }}>
            FrameIdx
          </Row>
          <Row>{frameIdx}</Row>
        </div>
        <div
          style={{
            border: "none",
            display: "grid",
            gridTemplateColumns: "auto 1fr 1fr",
            width: "100%",
          }}
        >
          <Row>
            <a
              target="_blank"
              href={videoUrl}
              rel="noopener noreferrer"
              style={{ color: "rgb(79, 70, 229)" }}
            >
              {videoUrl}
            </a>
          </Row>
          <Row>S:{timeStart}</Row>
          <Row>E:{timeEnd}</Row>
        </div>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSelectAnswer}
          disabled={
            answers.filter(
              (value) => value.video === video && value.frameIdx === frameIdx
            ).length > 0
          }
        >
          Select
        </Button>
      </Box>
    </InfoContainer>
  );
};

export default Info;
