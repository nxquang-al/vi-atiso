import React, { useState, useEffect } from "react";

import axios from "axios";
import styled from "styled-components";

import Info from "../Info";
import KeyFrame from "../KeyFrames/keyframe";
import KeyFrames from "../KeyFrames/";

const Container = styled.div`
  flex-direction: column;
  border: none !important;
  align-items: flex-start !important;
  width: 100%;
`;

const VideoBig = styled.video`
  width: 320px;
  height: 180px;
  border-radius: 6px;
  border: none;
`;

// const VideoSmall = styled.video`
//   width: 160px;
//   height: 90px;
//   border-radius: 6px;
//   border: none;
// `;

const Tag = styled.span`
  background-color: rgb(79, 70, 229);
  background-clip: border-box;
  border-radius: 6px;
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 6px;
  line-height: 19.6px;
  font-weight: 600;
  color: rgb(255, 255, 255);
`;

const Result = ({ result }) => {
  const videoUrl = `https://storage.googleapis.com/thangtd1/Video/${result.video}.mp4`;

  const [timeStart, setTimeStart] = useState(result.pts_time);
  const [timeEnd, setTimeEnd] = useState(0);
  const [frameIdx, setFrameIdx] = useState(result.frame_idx);

  const [metadata, setMetadata] = useState(0);

  useEffect(() => {
    const fetchLengthVideo = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/${result.video}/metadata`
      );

      setMetadata(data);
    };

    fetchLengthVideo();
  }, []);

  const timeUpdate = (e) => {
    const epsilon = 1;
    if (Math.abs(e.target.currentTime - timeEnd) < epsilon) {
      e.target.pause();
    }
  };

  const handleVideoMounted = (element) => {
    if (element !== null) {
      element.currentTime = timeStart;
      if (timeStart > 0) {
        element.play();
      }
    }
  };

  const onClickVideo = (rangeTime) => {
    setTimeStart(parseFloat(rangeTime.start));
    setTimeEnd(parseFloat(rangeTime.end));
    setFrameIdx(parseInt(rangeTime.frameIdx, 10));
  };

  return (
    <Container>
      <div
        style={{
          width: "100%",
          gap: 20,
          justifyContent: "flex-start",
          border: "none",
        }}
      >
        <Info
          video={result.video}
          frameIdx={frameIdx}
          metadata={metadata}
          timeStart={timeStart}
          timeEnd={timeEnd}
        >
          <KeyFrame
            keyframe={result.frame_name}
            video={result.video}
            size="large"
          />
          <div
            style={{
              position: "relative",
            }}
          >
            <Tag>{result.video}.mp4</Tag>
            <VideoBig
              controls
              key={videoUrl}
              ref={handleVideoMounted}
              muted
              onTimeUpdate={(e) => timeUpdate(e)}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </VideoBig>
          </div>
        </Info>
      </div>
      <KeyFrames
        result={result}
        videoLength={metadata.length}
        onClickVideo={onClickVideo}
      />
    </Container>
  );
};

export default Result;
