import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { Button } from "@mui/material";
import KeyFrame from "./keyframe";
import { useLocation } from "react-router-dom";

const KeyFrames = ({ result, onClickVideo, videoLength }) => {
  const ref = useRef(null);
  const [keyFrames, setKeyFrames] = useState([]);
  const [rangeTime, setRangeTime] = useState([]);

  const { pathname } = useLocation();

  const video = result.video || result.video_name;

  useEffect(() => {
    const fetchListKeyFrame = async () => {
      // const { data } = await axios.get(
      //   `${modelUrl}/${result.video}/keyframes/list`
      // );

      // if (pathname === "/CLIP2Video") {
      //   const { data } = await axios.get(
      //     `${process.env.REACT_APP_API_ENDPOINT}/${video}/frames/list`
      //   );
      //   const { list_frames } = data;

      //   if (list_frames.length > 0) {
      //     setKeyFrames(
      //       list_frames.map((frame) => frame[0].replace(`Frames/${video}/`, ""))
      //     );

      //     setRangeTime(list_frames.map((frame) => [frame[1], frame[2]]));
      //   }
      // } else {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/${video}/keyframes/list`
      );

      const { list_keyframes } = data;

      setKeyFrames(
        list_keyframes.map((keyFrame) =>
          keyFrame[0].replace(`Keyframes/${video}/`, "")
        )
      );

      const preprocess = list_keyframes.reduce(
        (prev, cur) => {
          return [
            ...prev,
            {
              start: prev.at(-1).end,
              end: cur[2],
              frameIdx: cur[4],
            },
          ];
        },
        [{ start: 0, end: 0 }]
      );

      const dump = preprocess
        .slice(1)
        .concat({ start: preprocess.at(-1).end, end: videoLength });

      setRangeTime(dump);
      // }
    };

    if (result.video !== "" && videoLength > 0) fetchListKeyFrame();
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
        {keyFrames.map((keyFrame, idx) => (
          <KeyFrame
            keyframe={keyFrame}
            rangeTime={rangeTime[idx]}
            video={video}
            scrollTo={keyFrame === result.frame_name}
            key={keyFrame + "list"}
            propsRef={ref}
            onClickVideo={onClickVideo}
          />
        ))}
      </div>
      <Button onClick={onClickScrollTo}>Scroll</Button>
    </div>
  );
};

export default KeyFrames;
