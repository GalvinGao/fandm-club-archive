import { Link } from "gatsby"
import * as React from "react"
import { isDev } from "../utils/env"

const OptLink: any = isDev ? Link : "div"

const Header = () => (
  <header className="mx-auto px-4 flex flex-col items-start justify-between mb-8">
    <OptLink to="/" className="text-2xl flex items-center no-underline">
      <img
        src="/images/logo.png"
        alt="Logo"
        width={1140}
        height={687}
        className="w-24 translate-y-0.5"
      />
      <div className="text-4xl ml-4 tracking-tight font-light">
        Old Budget Site Archive
      </div>
    </OptLink>

    <div className="h-[1px] w-full bg-gray-300 mt-6" />
  </header>
)

export default Header
