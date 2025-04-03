import { useNavigate } from "react-router";
function useRedirect(path: string) {
  const navigate = useNavigate();
  navigate(path);
}

export default useRedirect;
