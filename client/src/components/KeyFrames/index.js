import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { Button, IconButton } from "@mui/material";
import KeyFrame from "./keyframe";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

const KeyFrames = ({ result, onClickVideo, videoLength }) => {
  const ref = useRef(null);
  const [keyFrames, setKeyFrames] = useState([]);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const video = result.video || result.video_name;

  const handleLoadBefore = () => {
    if (keyFrames.length > 0) {
      if (start > 0 && start - 10 > 0) {
        setStart((prev) => prev - 5);
      }
      if (start - 10 < 0) {
        setStart(0);
      }
    }
  };

  const handleLoadAfter = () => {
    if (keyFrames.length > 0) {
      if (end + 5 < keyFrames.length - 1) {
        setEnd((prev) => prev + 5);
      }

      if (end + 5 > keyFrames.length - 1) {
        setEnd(keyFrames.length - 1);
      }
    }
  };

  useEffect(() => {
    const fetchListKeyFrame = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_OCR_VM_IP}/frame/${video}`
      );

      const idx = data.data.findIndex(
        (x) =>
          x.frame_name === result.frame_name &&
          x.folder === result.folder.toLowerCase()
      );

      if (idx - 5 > 0) {
        setStart(idx - 5);
      } else {
        setStart(0);
      }

      if (idx + 5 < data.data.length - 1) {
        setEnd(idx + 5);
      } else {
        setEnd(data.data.length - 1);
      }

      setKeyFrames(data.data);
    };

    if (video !== "" && videoLength > 0) fetchListKeyFrame();
  }, [videoLength]);

  const onClickScrollTo = () => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    onClickScrollTo();
  }, []);

  return (
    <div
      style={{
        width: "calc(90vw - 40px)",
        gap: 10,
      }}
    >
      <div
        style={{
          overflowX: "scroll",
          border: "none",
          justifyContent: "flex-start",
        }}
      >
        <IconButton onClick={handleLoadBefore}>
          <NavigateBeforeIcon color="info" />
        </IconButton>
        {keyFrames.slice(start, end + 1).map((keyFrame, idx) => (
          <KeyFrame
            keyframe={keyFrame.frame_name}
            rangeTime={keyFrame.range_time}
            video={video}
            scrollTo={keyFrame.frame_name === result.frame_name}
            key={keyFrame.frame_name + "list" + keyFrame.folder}
            propsRef={ref}
            onClickVideo={onClickVideo}
            folder={keyFrame.folder}
            frameIdx={keyFrame.frame_id}
          />
        ))}
        <IconButton onClick={handleLoadAfter}>
          <NavigateNextIcon color="info" />
        </IconButton>
      </div>
      <Button onClick={onClickScrollTo}>Scroll</Button>
    </div>
  );
};

export default KeyFrames;
