"use client";

import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase";
import { FiLogOut } from "react-icons/fi";
import { useSignOut } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";


const Navbar = () => {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isFaculty, setIsFaculty] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setDisplayName(userData.displayName || "Anonymous");
          setIsFaculty(userData.role === "faculty");
        }
      }
    };

    fetchUserData();
  }, [user]);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
          {isFaculty && (
            <Link href="/report" className="text-white">
              Report
            </Link>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {user && !isFaculty && (
            <Link href="/profile" className="text-white">
              {displayName}
            </Link>
          )}
          {user ? (
            <button
              className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange"
              onClick={handleLogout}
            >
              <FiLogOut />
            </button>
          ) : (
            <Link href="/auth/signin" className="text-white">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
