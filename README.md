## Section 1: Folder Structure

### 1. Define a folder structure

- create a folder using Nextjs without src and app folder

```bash
npx create-next-app --typescript
```

### 2. install tailwind css

- install [Tailwind CSS](https://tailwindcss.com/docs/guides/nextjs)

```js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- Configure your template paths

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- Add the Tailwind directives to your CSS

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Section 2: Auth Screen UI

### 3. Global style

- add global style in [globals.css](/styles/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-zinc-900 h-full overflow-x-hidden;
}

#__next {
  @apply h-full;
}

html {
  @apply h-full;
}
```

### 4. Authentication

- create [Input](/components/Input.tsx)

```tsx
interface InputProps {
  id: string;
  onChange: any;
  value: string;
  label: string;
  type?: string;
}

const Input = ({ id, onChange, value, label, type }: InputProps) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        value={value}
        type={type}
        id={id}
        className="
        block
        rounded-md
        px-6
        pt-6
        pb-1
        w-full
        text-md
      text-white
      bg-neutral-700
        appearance-none
        focus:outline-none
        focus:ring-0
        peer
        invalid:border-b-1
        "
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="
        absolute 
        text-md
      text-zinc-400
        duration-150 
        transform 
        -translate-y-3 
        scale-75 
        top-4 
        z-10 
        origin-[0] 
        left-6
        peer-placeholder-shown:scale-100 
        peer-placeholder-shown:translate-y-0 
        peer-focus:scale-75
        peer-focus:-translate-y-3
      "
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
```

- create [Auth](/pages/auth.tsx)

```tsx
import Input from "@/components/Input";
import { useCallback, useState } from "react";

const Auth = () => {
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
  return (
    <div className=" relative w-full h-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-cover bg-fixed">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" alt="" className="h-12" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-4xl mb-8 text-white font-semibold">
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
              <button className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                {variant === "login" ? "Login" : "Sign up"}
              </button>
              <p className="text-neutral-500 mt-12">
                {variant === "login"
                  ? "First time using Netflix?"
                  : "Already have an account?"}
                <span
                  className="text-white ml-1 hover:underline cursor-pointer"
                  onClick={toggleVariant}
                >
                  {variant === "login" ? "Create an account" : "Login"}
                </span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
```

### 5.

### 6.
