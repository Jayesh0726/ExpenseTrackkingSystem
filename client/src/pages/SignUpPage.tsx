import React from 'react'
import SpotLight from '@/components/ui/spot-light'
import { Signup } from '@/components'
function SignUpPage() {
  return (
    <div className="flex px-5 flex-col items-center justify-center min-h-screen bg-gray-950 ">
      <SpotLight bgcolor={"bg-gray-100"} height={"h-64"} width={"w-64"} blur={"blur-[200px]"} left={"-left-24"} top={"top-72"} />
      <SpotLight bgcolor={"bg-gray-100"} height={"h-24"} width={"w-24"} blur={"blur-[100px]"} left={"left-[57%]"} top={"top-[13%]"} translateX={"translate-x-[0%]"} translateY={"translate-y-[0%]"}/>
    
      <Signup />
    </div>
  )
}

export default SignUpPage
