import { useSession } from "@clerk/clerk-react";

import { useNavigate } from "react-router";
import Profile from "../components/profile-dashboard/Profile";
import FriendsList from "../components/friends-list/FriendsList";
import { useEffect } from "react";
function Dashboard() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useSession();

  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      navigate("/");
    }
  }, [isSignedIn, navigate, isLoaded]);

  if (!isLoaded) {
    return <p>loading...</p>;
  }

  return (
    <div className="p-4 h-screen ">
      <div className="h-full md:w-[250px] w-full flex flex-col gap-4 justify-between">
        <FriendsList />
        <Profile />
      </div>
    </div>
  );
}

export default Dashboard;
