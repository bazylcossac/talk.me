import { useSession, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import Profile from "../components/profile-dashboard/Profile";
import FriendsList from "../components/friends-list/FriendsList";
import { useEffect } from "react";
import { connectToWebSocket, userJoin } from "@/connection/webSocketConnection";
import { userStatus } from "@/lib/constants";
import MainCallContainer from "@/components/main-call/MainCallContainer";
import IncomingCallsContainer from "@/components/incoming-calls/IncomingCallsContainer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function Dashboard() {
  const currentUser = useUser();
  const { isSignedIn, isLoaded } = useSession();
  const navigate = useNavigate();
  const { user } = currentUser;
  const userActivity = useSelector(
    (state: RootState) => state.user.userActiveStatus
  );
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
      userJoin(userData);
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
    <div className="p-4 h-screen  flex flex-row gap-4">
      <div className="h-full md:w-[250px] w-full flex flex-col gap-4 justify-between">
        <FriendsList />
        <Profile />
      </div>
      <div className="w-full h-full">
        <MainCallContainer />
      </div>
      {userActivity !== userStatus.DONT_DISTURB && <IncomingCallsContainer />}
    </div>
  );
}

export default Dashboard;
