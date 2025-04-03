import { useSession } from "@clerk/clerk-react";

import { useNavigate } from "react-router";
import Profile from "../components/profile-dashboard/Profile";
import FriendsList from "../components/friends-list/FriendsList";
function Dashboard() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useSession();

  if (!isSignedIn) {
    navigate("/");
  }

  if (!isLoaded) {
    return <p>loading...</p>;
  }

  return (
    <div className="p-10 h-screen">
      <div className="h-full  w-[250px] flex flex-col gap-4 justify-between">
        <FriendsList />
        <Profile />
      </div>
    </div>
  );
}

export default Dashboard;
