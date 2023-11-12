import React, { useState } from "react";
import styled from "styled-components";

const ImageSmall = styled.img`
  width: 160px;
  height: 90px;
  border: none;
  border-radius: 6px;
`;

const ImageBig = styled.img`
  width: 320px;
  height: 180px;
  border: none;
  border-radius: 6px;
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

const KeyFrame = ({
  keyframe,
  video,
  size = "small",
  scrollTo = false,
  propsRef,
  rangeTime,
  folder = "Keyframes",
  frameIdx = 0,
  onClickVideo = () => {},
}) => {
  const validationKeyFrameName = () => {
    const idVideo = parseInt(video.slice(1, 3));

    if (idVideo >= 17) {
      if (keyframe.length === 8) {
        return keyframe.slice(1);
      }
    }

    return keyframe;
  };

  const [showTag, setShowTag] = useState(size !== "small");

  const capFolder = () => {
    return folder.charAt(0).toUpperCase() + folder.slice(1);
  };

  const keyFrameUrl = `https://storage.googleapis.com/thangtd1/${capFolder()}/${video}/${validationKeyFrameName()}`;

  return (
    <KeyframeContainer
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
      onClick={() => onClickVideo(rangeTime, frameIdx)}
      tabIndex={0}
    >
      {showTag && (
        <Tag>
          {capFolder().charAt(0)} - {validationKeyFrameName()}
        </Tag>
      )}

      {size === "small" && <ImageSmall src={keyFrameUrl} alt={keyFrameUrl} />}
      {size === "large" && <ImageBig src={keyFrameUrl} alt={keyFrameUrl} />}
    </KeyframeContainer>
  );
};

export default KeyFrame;
