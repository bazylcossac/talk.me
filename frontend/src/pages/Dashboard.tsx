import { useSession, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import Profile from "../components/profile-dashboard/Profile";
import FriendsList from "../components/friends-list/FriendsList";
import { useEffect } from "react";
import {
  connectToWebSocket,
  handleUserJoin,
} from "@/connection/webSocketConnection";
import { userStatus } from "@/lib/constants";

function Dashboard() {
  const currentUser = useUser();
  const { isSignedIn, isLoaded } = useSession();
  const navigate = useNavigate();
  const { user } = currentUser;

  useEffect(() => {
    connectToWebSocket();
  }, []);

  useEffect(() => {
    if (user) {
      const userData = {
        username: user.username || (user.fullName as string),
        imageUrl: user.imageUrl,
        status: userStatus.ACTIVE,
      };
      handleUserJoin(userData);
    }
  }, [user]);

  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      navigate("/");
    }
  }, [isSignedIn, navigate, isLoaded, user]);

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
