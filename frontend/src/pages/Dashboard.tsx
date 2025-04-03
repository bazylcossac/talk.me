import { UserButton, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
function Dashboard() {
  const navigate = useNavigate();
  const { isSignedIn } = useSession();

  if (!isSignedIn) {
    navigate("/");
  }

  return (
    <div>
      <UserButton />
    </div>
  );
}

export default Dashboard;
