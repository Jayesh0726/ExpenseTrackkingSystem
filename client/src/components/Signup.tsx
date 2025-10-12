import React from "react"
import { useState } from "react"
import InputField from "./InputField"
import { useForm } from "react-hook-form"
import ButtonField from "./Button"
import { Chrome, Github, Eye, EyeOff } from "lucide-react"
import SpotLight from "./ui/spot-light"

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [confirmShowPassword, setConfirmShowPassword] = useState(false)
  const handleGoogleOAuth = () => {
    window.location.href = `api/auth/google`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 ">
      <SpotLight bgcolor={"bg-gray-100"} height={"h-64"} width={"w-64"} blur={"blur-[200px]"} left={"-left-24"} top={"top-72"} />
      <SpotLight bgcolor={"bg-gray-100"} height={"h-24"} width={"w-24"} blur={"blur-[100px]"} left={"left-[57%]"} top={"top-[13%]"} translateX={"translate-x-[0%]"} translateY={"translate-y-[0%]"}/>
      
      <div className=" bg-[#2b2b2b5e] backdrop-blur border border-black/10 p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <form className="space-y-4">
          <div className="text-white text-xl font-semibold text-center">Sign-Up</div>
          <InputField
            label="Username"
            type="text"
            placeholder="Enter your username"
            {...register("username", {
              required: true,
              validate: {
                minLength: (value: string) =>
                  value.length >= 3 || "Username must be at least 3 characters long",
              },
            })}
          />
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
            className="cursor-pointer absolute right-12 top-[16.5rem] text-gray-500"
          />
          <EyeOff
            style={{ display: showPassword ? "block" : "none" }}
            onClick={() => setShowPassword((prev) => !prev)}
            className="cursor-pointer absolute right-12 top-[16.5rem] text-gray-500"
          />

          <InputField
            label="Confirm Password"
            type={confirmShowPassword ? "text" : "password"}
            placeholder="Confirm your password"
            {...register("confirmPassword", {
              required: true,
              validate: {
                minLength: (value: string) =>
                  value.length >= 6 || "Password must be at least 6 characters long",
                matchesPassword: (value: string) =>
                  value === getValues("password") || "Passwords do not match",
              },
            })}
          />
          <Eye
            style={{ display: confirmShowPassword ? "none" : "block" }}
            onClick={() => setConfirmShowPassword((prev) => !prev)}
            className="cursor-pointer absolute right-12 top-[21.4rem] text-gray-500"
          />
          <EyeOff
            style={{ display: confirmShowPassword ? "block" : "none" }}
            onClick={() => setConfirmShowPassword((prev) => !prev)}
            className="cursor-pointer absolute right-12 top-[21.4rem] text-gray-500"
          />

          {/* Show error message for confirmPassword */}
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm">{errors.confirmPassword.message as string}</p>
          )}

          <ButtonField type="submit" children="Sign Up" variant="default" className="w-full mt-4 cursor-pointer" />
          <div className="flex items-center justify-center my-4">
            <hr className="w-full border-gray-600" />
            <span className="mx-2 text-white/60">OR</span>
            <hr className="w-full border-gray-600" />
          </div>
          <ButtonField
            children="Continue with Google"
            variant="outline"
            className="w-full cursor-pointer"
            type="button"
            icon={<Chrome className="h-4 w-4 mr-2" />}
            onClick={handleGoogleOAuth}
          />
          <ButtonField
            children="Continue with GitHub"
            variant="outline"
            type="button"
            className="w-full cursor-pointer"
            icon={<Github className="h-4 w-4 mr-2" />}
          />
        </form>
        <p className="mt-4 text-center text-base text-white/60">
          Already have an account?&nbsp;
        </p>
      </div>
    </div>
  )
}

export default Signup