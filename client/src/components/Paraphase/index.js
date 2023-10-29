import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Configuration, OpenAIApi } from "openai";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";

const Para = styled.div`
  &:hover {
    cursor: pointer;
  }
  padding: 5px;
`;

const Paraphase = ({ defaultPrompt, maxOutput, setQuery }) => {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query");
  const [isLoading, setIsLoading] = useState(false);
  const [paragraphs, setParagraphs] = useState([]);
  const [choice, setChoice] = useState(-1);

  const handleSendPrompt = async () => {
    // e.preventDefault();
    setIsLoading(true);
    try {
      const messages = [
        {
          role: "user",
          content: `${defaultPrompt} [START-PROMPT]${query}[END-PROMPT]. Please generate ${maxOutput} results. One in each line without any mark or number at the beginning`,
        },
      ];

      const { data } = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });

      const response = data.choices[0].message.content;

      const result = response.split(/\r\n|\r|\n/).filter((e) => e !== "");

      setParagraphs(result);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (query !== "") {
      handleSendPrompt();
    }
  }, [query, defaultPrompt]);

  return (
    <>
      {!isLoading ? (
        <>
          {paragraphs.map((para, idx) => (
            <div
              style={{ border: "none", flexDirection: "column" }}
              key={`Prompt-idx-${idx}`}
            >
              <Para
                onClick={() => {
                  setQuery(para);
                  setChoice(idx);
                }}
                style={idx === choice ? { border: "1px solid orange" } : {}}
              >
                {para}
              </Para>
              <div
                style={{ width: "100%", height: 10, borderColor: "#c4c4c4" }}
              ></div>
            </div>
          ))}
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Paraphase;
