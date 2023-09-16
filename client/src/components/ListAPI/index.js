import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { APIContext } from "../../contexts/APIContext";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";

const Container = styled.div`
  width: calc(90vw + 16px);
  justify-content: flex-start !important;
  overflow-x: scroll;
`;

const Api = ({ api }) => {
  const { setApis } = useContext(APIContext);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const [editAble, setEditAble] = useState(false);
  const [name, setName] = useState(api.name);
  const [url, setUrl] = useState(api.url);

  const handleDeleteAPI = (api) => {
    setApis((prev) =>
      prev.filter((ap) => ap.name !== api.name && ap.url !== api.url)
    );
  };

  const handleChangeAPIName = (e) => {
    setName(e.target.value);
  };

  const handleChangeAPIUrl = (e) => {
    setUrl(e.target.value);
  };

  function useNavigateParams() {
    const navigate = useNavigate();

    return (url, params) => {
      const searchParams = createSearchParams(params).toString();
      navigate(url + "?" + searchParams);
    };
  }

  const navigateParams = useNavigateParams();

  const handleChooseAPI = () => {
    const query = new URLSearchParams(search).get("query");
    const topK = new URLSearchParams(search).get("topK");

    navigateParams(api.name, {
      query,
      topK,
      modelUrl: api.url,
    });
  };

  useEffect(() => {
    if (!editAble)
      if (name !== api.name || url !== api.url) {
        setApis((prev) =>
          prev.map((ap) => {
            if (ap.name === api.name && ap.url === api.url) {
              return {
                name,
                url,
              };
            } else return { ...ap };
          })
        );
      }
  }, [editAble]);

  return (
    <div
      style={{
        border: pathname.slice(1) === api.name ? "2px solid orange" : "none",
        backgroundColor: "rgb(31,41,55)",
        padding: 10,
      }}
    >
      <IconButton
        aria-label="edit"
        onClick={() => setEditAble((prev) => !prev)}
        style={{ color: "orange" }}
      >
        <EditIcon color="inherit" />
      </IconButton>
      <TextField
        value={name}
        sx={{
          color: "#c4c4c4",
          backgroundColor: "#ffffd5",
          width: 100,
          textAlign: "center",
        }}
        onInput={handleChangeAPIName}
        disabled={!editAble}
      />
      <TextField
        value={url}
        sx={{
          color: "#ffffd5",
          backgroundColor: "#ffffd5",
        }}
        disabled={!editAble}
        onChange={handleChangeAPIUrl}
      />
      <IconButton
        aria-label="close"
        onClick={() => handleDeleteAPI(api)}
        style={{ color: "orange" }}
      >
        <CloseIcon color="inherit" />
      </IconButton>
      <IconButton
        aria-label="choose"
        onClick={handleChooseAPI}
        style={{ color: "orange" }}
      >
        <TouchAppIcon color="inherit" />
      </IconButton>
    </div>
  );
};

const ListAPI = () => {
  const { apis, setApis } = useContext(APIContext);

  const handleAddNewApi = () => {
    setApis((prev) => [
      ...prev,
      {
        name: prev.at(-1).name + "(new api)",
        url: prev.at(-1).url,
      },
    ]);
  };

  return (
    <Container>
      {apis.map((api) => (
        <Api api={api} key={api.name + "-" + api.url} />
      ))}
      <IconButton style={{ color: "orange" }} onClick={handleAddNewApi}>
        <AddCircleIcon color="inherit" />
      </IconButton>
    </Container>
  );
};

export default ListAPI;
