import React, { useContext } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { AnswerProvider } from "../contexts/AnswerContext";
import { APIContext } from "../contexts/APIContext";

import Home from "../pages/Home";
import NotFoundPageError from "../components/NotFoundPageError";
import Results from "../components/Result";

const Router = () => {
  const { apis } = useContext(APIContext);

  const ROUTES = [
    {
      path: "/",
      element: (
        <AnswerProvider>
          <Home>
            <Outlet />
          </Home>
        </AnswerProvider>
      ),
      errorElement: <NotFoundPageError />,
      children: apis.map((api) => ({ path: api.name, element: <Results /> })),
    },
  ];

  return <RouterProvider router={createBrowserRouter(ROUTES)} />;
};

export default Router;
