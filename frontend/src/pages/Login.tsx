import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

function Login() {
  return (
    <div className="">
      <SignIn
        appearance={{
          baseTheme: dark,
        }}
      />
    </div>
  );
}

export default Login;
