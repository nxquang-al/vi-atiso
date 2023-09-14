import React, { createContext, useContext, useMemo, useState } from "react";
import styled from "styled-components";

const AnswerContext = createContext(null);

const Provider = styled.div`
  border: none;
`;

const AnswerProvider = ({ children }) => {
  const [answers, setAnswers] = useState([]);

  const value = useMemo(() => ({
    answers: answers,
    setAnswers: setAnswers,
  }));

  return (
    <AnswerContext.Provider
      value={value}
      style={{
        border: "none",
      }}
    >
      {children}
    </AnswerContext.Provider>
  );
};

export { AnswerContext, AnswerProvider };
