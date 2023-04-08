import Input from "@/components/Input";
import axios from "axios";
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/router";

const Auth = () => {
  // const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  //variant is used to toggle between login and register
  const [variant, setVariant] = useState("login");

  //toggle between login and register
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  //login user
  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        // redirect: false,
        callbackUrl: "/profiles", //replace "/" to "/profiles" to redirect to profiles page after login
      });

      // router.push("/"); remove router as a dependencies
    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  //resgister user
  const register = useCallback(async () => {
    try {
      await axios.post("/api/register", {
        email,
        name,
        password,
      });

      //if user is registered successfully, login the user
      login();
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password, login]);

  return (
    <div className=" relative w-full h-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="w-full h-full bg-black lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="" className="h-12" />
        </nav>
        <div className="flex justify-center">
          <div className="self-center w-full px-16 py-16 mt-2 bg-black rounded-md bg-opacity-70 lg:w-2/5 lg:max-w-md">
            <h2 className="mb-8 text-4xl font-semibold text-white">
              {variant === "login" ? "Sign in" : "Register"}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === "register" && (
                <Input
                  id="name"
                  type="text"
                  label="Username"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              )}
              <Input
                id="email"
                type="email"
                label="Email address or phone number"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
              <button
                onClick={variant === "login" ? login : register}
                className="w-full py-3 mt-10 text-white transition bg-red-600 rounded-md hover:bg-red-700"
              >
                {variant === "login" ? "Login" : "Sign up"}
              </button>
              <div className="flex flex-row items-center justify-center gap-4 mt-8">
                <div
                  onClick={() => signIn("google", { callbackUrl: "/profiles" })}
                  className="flex items-center justify-center w-10 h-10 transition bg-white rounded-full cursor-pointer hover:opacity-80"
                >
                  <FcGoogle size={32} />
                </div>
                <div
                  onClick={() => signIn("github", { callbackUrl: "/profiles" })}
                  className="flex items-center justify-center w-10 h-10 transition bg-white rounded-full cursor-pointer hover:opacity-80"
                >
                  <FaGithub size={32} />
                </div>
              </div>
              <p className="mt-12 text-neutral-500">
                {variant === "login"
                  ? "First time using Netflix?"
                  : "Already have an account?"}
                <span
                  className="ml-1 text-white cursor-pointer hover:underline"
                  onClick={toggleVariant}
                >
                  {variant === "login" ? "Create an account" : "Login"}
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
