import React from "react"
import { useState } from "react"
import InputField from "./InputField"
import { useForm } from "react-hook-form"
import ButtonField from "./Button"
import { Chrome, Github, Eye, EyeOff } from "lucide-react"
function Login() {
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm()
const [showPassword, setShowPassword] = useState(false)
const handleGoogleOAuth = () => {
  window.location.href = `api/auth/google`
}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative">
      <form className="space-y-4">
        <div className="text-white text-lg font-semibold text-center">Log-In</div>
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: true,
            validate: {
              matchPattern: (value: string) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Email address must be a valid address",
            },
          })}
        />
        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          {...register("password", {
            required: true,
            validate: {
              minLength: (value: string) =>
                value.length >= 6 || "Password must be at least 6 characters long",
            },
          })}
        />
        <Eye
          style={{ display: showPassword ? "none" : "block" }}
          onClick={() => setShowPassword((prev) => !prev)}
          className="cursor-pointer absolute right-12 top-[11.6rem] text-gray-500"
        />
        <EyeOff
          style={{ display: showPassword ? "block" : "none" }}
          onClick={() => setShowPassword((prev) => !prev)}
          className="cursor-pointer absolute right-12 top-[11.6rem] text-gray-500"
        />
        <ButtonField type="submit" children="Login" variant="default" className="w-full mt-4 cursor-pointer" />
        <div className="flex items-center justify-center my-4">
          <hr className="w-full border-gray-600" />
          <span className="mx-2 text-white/60">OR</span>
          <hr className="w-full border-gray-600" />
      </div>
        <ButtonField
          children="Login with Google"
          variant="outline"
          className="w-full cursor-pointer"
          type="submit"
          icon={<Chrome className="h-4 w-4 mr-2" />}
          onClick={handleGoogleOAuth}
        />
        <ButtonField 
        children="Login with GitHub"
        variant="outline"
        type="submit"
        className="w-full cursor-pointer"
        icon={<Github className="h-4 w-4 mr-2" />}
        />
      </form>
      <p className="mt-4 text-center text-base text-white/60">
                    Don&apos;t have any account?&nbsp;
                    
        </p>
      </div>
    </div>
  )
}

export default Login
