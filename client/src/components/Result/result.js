import React, { useState, useEffect } from "react";

import axios from "axios";
import styled from "styled-components";

import Info from "../Info";
import KeyFrame from "../KeyFrames/keyframe";
import KeyFrames from "../KeyFrames/";
import { useLocation } from "react-router-dom";

const Container = styled.div`
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

const Top = styled.div`
  height: 100%;
  // min-width: 50px;
  background-color: rgb(55, 65, 81);
  color: #c4c4c4;
  padding: 0px 10px;
  font-weight: bold;
  font-size: 2.3rem;
  text-wrap: break-word;
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

const Result = ({ result, top }) => {
  const videoUrl = `https://storage.googleapis.com/thangtd1/Video/${result.video ||
    result.video_name}.mp4`;

  const { search } = useLocation();
  const modelUrl = new URLSearchParams(search).get("modelUrl");

  const [timeStart, setTimeStart] = useState(
    result.pts_time || result.start_time
  );
  const [timeEnd, setTimeEnd] = useState(result.end_time || 0);
  const [frameIdx, setFrameIdx] = useState(
    result.frame_idx || parseInt(result.start_time * 25)
  );
  const [metadata, setMetadata] = useState(0);

  useEffect(() => {
    const fetchLengthVideo = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/${result.video ||
          result.video_name}/metadata`
      );
      // const { data } = await axios.get(`${modelUrl}/${result.video}/metadata`);

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
      if (!isFinite(timeStart)) element.currentTime = timeStart;
      else {
        console.log(timeStart);
      }
      // if (timeStart > 0) {
      //   element.play();
      // }
    }
  };

  const onClickVideo = (rangeTime) => {
    setTimeStart(parseFloat(rangeTime.start));
    setTimeEnd(parseFloat(rangeTime.end));
    setFrameIdx(parseInt(rangeTime.frameIdx));
  };

  const mapFrameIdxToFrameName = () => {
    return "0010.jpg";
  };

  return (
    <Container>
      <Top>{top}</Top>
      <div
        style={{
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            gap: 20,
            justifyContent: "flex-start",
            border: "none",
          }}
        >
          <Info
            video={result.video || result.video_name}
            frameIdx={frameIdx}
            metadata={metadata}
            timeStart={timeStart}
            timeEnd={timeEnd}
          >
            <KeyFrame
              keyframe={result.frame_name || mapFrameIdxToFrameName()}
              video={result.video || result.video_name}
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
      </div>
    </Container>
  );
};

export default Result;
