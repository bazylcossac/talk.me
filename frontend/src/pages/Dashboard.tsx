import { useSession, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { connectToWebSocket, userJoin } from "@/connection/webSocketConnection";
import { userStatus } from "@/lib/constants";
import MainCallContainer from "@/components/main-call/MainCallContainer";
import IncomingCallsContainer from "@/components/incoming-calls/IncomingCallsContainer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import LeftContainer from "@/components/LeftContainer";
import RightContainer from "@/components/RightContainer";
import Loading from "@/components/loading";

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

  if (!isSignedIn && isLoaded) {
    navigate("/");
  }

  if (!isLoaded) {
    return (
      <div className=" h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <main className="p-4 h-screen flex flex-row gap-4 ">
      <section>
        <LeftContainer />
      </section>
      <section className="w-full h-full flex-1">
        <MainCallContainer />
      </section>
      <section>
        <RightContainer />
      </section>
      {userActivity !== userStatus.DONT_DISTURB && <IncomingCallsContainer />}
    </main>
  );
}

export default Dashboard;
