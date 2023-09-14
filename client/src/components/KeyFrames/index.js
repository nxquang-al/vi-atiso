import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { KeyFrame } from "../Result";
import { Button } from "@mui/material";

const KeyFrames = ({ result, onClickVideo }) => {
  const ref = useRef(null);
  const [keyFrames, setKeyFrames] = useState([]);
  const [rangeTime, setRangeTime] = useState([]);

  useEffect(() => {
    const fetchListKeyFrame = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/${result.video}/keyframes/list`
      );

      const { list_keyframes } = data;

      setKeyFrames(
        list_keyframes.map((keyFrame) =>
          keyFrame[0].replace(`Keyframes/${result.video}/`, "")
        )
      );

      const preprocess = list_keyframes.reduce(
        (prev, cur) => {
          return [
            ...prev,
            {
              start: prev.at(-1).end,
              end: cur[2],
            },
          ];
        },
        [{ start: 0, end: 0 }]
      );

      const dump = preprocess
        .slice(1)
        .concat({ start: preprocess.at(-1).end, end: 0 });

      setRangeTime(dump);
    };

    if (result.video !== "") fetchListKeyFrame();
  }, []);

  const onClickScrollTo = () => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  return (
    <div
      style={{
        width: "90vw",
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
            video={result.video}
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