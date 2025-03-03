"use client"

import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { FiLogOut } from "react-icons/fi"
import { useSignOut } from "react-firebase-hooks/auth"

const Navbar = () => {
  const [user] = useAuthState(auth)
  const [signOut, loading, error] = useSignOut(auth)

  const handleLogout = async () => {
    try {
      await signOut() // Ensure user is signed out
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <nav className="bg-dark-layer-2 p-4 border-b-2 border-b-yellow-700">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <Link href="/practice" className="text-white font-bold text-xl">
          Code Sharda
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/practice" className="text-white">
            Problems
          </Link>
          <Link href="/contests" className="text-white">
            Contests
          </Link>
          <Link href="/leaderboard" className="text-white">
            Leaderboard
          </Link>
          <Link href="/profile" className="text-white">
            Profile
          </Link>
        </div>
        {user && (
          <button
            className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange"
            onClick={handleLogout}
          >
            <FiLogOut />
          </button>
        )}

        {!user && (
          <Link href="/auth/signin" className="text-white">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
