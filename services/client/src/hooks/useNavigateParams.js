import { createSearchParams, useNavigate } from "react-router-dom";
function useNavigateParams() {
  const navigate = useNavigate();

  return (url, params) => {
    const searchParams = createSearchParams(params).toString();
    navigate(url + "?" + searchParams);
  };
}

export { useNavigateParams };
