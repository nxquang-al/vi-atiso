import React, { useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { TextField } from "@mui/material";

const Container = styled.div`
  color: #c4c4c4 !important;
`;

const Dres = ({ sessionId, setSessionId }) => {
  const fetchSessionId = async () => {
    const { data } = await axios.post(
      "https://eventretrieval.one/api/v1/login",
      {
        username: "atiso",
        password: "owoch7Ah",
      }
    );

    setSessionId(data.sessionId);
  };

  useEffect(() => {
    fetchSessionId();
  }, []);

  return (
    <Container>
      <TextField
        placeholder="https://eventretrieval.one/user"
        value={sessionId}
        onChange={(e) => {
          setSessionId(e.target.value);
        }}
        fullWidth
        sx={{
          backgroundColor: "rgb(55, 65, 81)",
          borderRadius: "5px",
          boxShadow: "rgba(0, 0, 0, 0.1)",
        }}
      />
    </Container>
  );
};

export default Dres;
