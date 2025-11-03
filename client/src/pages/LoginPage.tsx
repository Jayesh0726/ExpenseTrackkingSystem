import React from 'react'
import { Login } from '@/components'
import SpotLight from "@/components/ui/spot-light"

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center px-5 min-h-screen bg-gray-950">
      <SpotLight bgcolor={"bg-gray-100"} height={"h-64"} width={"w-64"} blur={"blur-[200px]"} left={"-left-24"} top={"top-72"} />
      <SpotLight bgcolor={"bg-gray-100"} height={"h-24"} width={"w-24"} blur={"blur-[100px]"} left={"left-[57%]"} top={"top-[17%]"} translateX={"translate-x-[0%]"} translateY={"translate-y-[0%]"}/>
      <Login />
    </div>
  )
}

export default LoginPage
