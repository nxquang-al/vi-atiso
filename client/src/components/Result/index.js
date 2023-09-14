import React, { useEffect, useRef, useState } from "react";

import styled from "styled-components";
import KeyFrames from "../KeyFrames";

const Result = styled.div`
  flex-direction: column;
  border: none !important;
  align-items: flex-start !important;
  width: 100%;
`;

const ImageSmall = styled.img`
  width: 160px;
  height: 90px;
  border: none;
  border-radius: 6px;
`;
const VideoSmall = styled.video`
  width: 160px;
  height: 90px;
  border-radius: 6px;
  border: none;
`;

const ImageBig = styled.img`
  width: 320px;
  height: 180px;
  border: none;
  border-radius: 6px;
`;
const VideoBig = styled.video`
  width: 320px;
  height: 180px;
  border-radius: 6px;
  border: none;
`;

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

const KeyframeContainer = styled.div`
  position: relative;
  border-radius: 8;
  &:hover {
    cursor: pointer;
  }
`;

const ConsoleBucketUrl = `https://console.cloud.google.com/storage/browser/_details/thangtd1`;

export const KeyFrame = ({
  keyframe,
  video,
  size = "small",
  scrollTo = false,
  propsRef,
  rangeTime,
  onClickVideo = () => {},
}) => {
  const [showTag, setShowTag] = useState(size !== "small");

  const keyFrameUrl = `https://storage.googleapis.com/thangtd1/Keyframes/${video}/${keyframe}`;

  return (
    <KeyframeContainer
      //   href={`${ConsoleBucketUrl}/Keyframes/${video}/${keyframe};tab=live_object`}
      //   target="_blank"
      style={{
        border: scrollTo ? "3px solid red" : "none",
      }}
      ref={scrollTo ? propsRef : null}
      onMouseEnter={() => {
        setShowTag(true);
      }}
      onMouseLeave={() => {
        setShowTag(size !== "small");
      }}
      onClick={() => onClickVideo(rangeTime)}
      tabIndex={0}
    >
      {showTag && <Tag>{keyframe}</Tag>}

      {size === "small" && <ImageSmall src={keyFrameUrl} alt={keyFrameUrl} />}
      {size === "large" && <ImageBig src={keyFrameUrl} alt={keyFrameUrl} />}
    </KeyframeContainer>
  );
};

const Results = ({ results }) => {
  const str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };

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
        results.map((result) => {
          const videoUrl = `https://storage.googleapis.com/thangtd1/Video/${result.video}.mp4`;

          const [timeStart, setTimeStart] = useState(0);
          const [timeEnd, setTimeEnd] = useState(0);

          //   const videoRef = useRef(null);

          const timeUpdate = (e) => {
            if (e.target.currentTime !== timeEnd) {
              e.target.pause();
            }
          };

          const handleVideoMounted = (element) => {
            if (element !== null) {
              element.currentTime = timeStart;
            }
          };

          const onClickVideo = (rangeTime) => {
            setTimeStart(rangeTime.start);
            setTimeEnd(rangeTime.end);
          };

          return (
            <Result key={JSON.stringify(result)}>
              <div>
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
                  <Tag>
                    {result.video}.mp4, {result.distance}
                  </Tag>
                  <VideoBig
                    controls
                    key={videoUrl}
                    ref={handleVideoMounted}
                    // ref={videoRef}
                    muted
                    onTimeUpdate={(e) => timeUpdate(e)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </VideoBig>
                </div>
              </div>
              <KeyFrames result={result} onClickVideo={onClickVideo} />
            </Result>
          );
        })}
    </div>
  );
};

export default Results;
