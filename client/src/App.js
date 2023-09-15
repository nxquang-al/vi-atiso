import React, { useState, useEffect } from "react";

import { APIProvider } from "./contexts/APIContext";

import Router from "./routes";

const App = () => {
  return (
    <APIProvider>
      <Router />
    </APIProvider>
  );
};

export default App;
