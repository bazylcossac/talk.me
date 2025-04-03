import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import Logo from "../components/Logo";

function Login() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="fixed top-0 right-0 ">
        <Logo />
      </div>

      <h1 className="text-4xl px-4  md:text-6xl  font-bold mb-10 text-center">
        Your video conference <span className="text-blue-500 ">app</span>
      </h1>
      <SignIn
        appearance={{
          baseTheme: dark,
        }}
      />
    </div>
  );
}

export default Login;
