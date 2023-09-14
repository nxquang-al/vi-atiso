import React, { createContext, useMemo, useState } from "react";

const AnswerContext = createContext(null);

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
