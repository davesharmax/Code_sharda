import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebase";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/practice");
      } else {
        router.push("/auth");
      }
    }
  }, [user, loading, router]);

  return <div>Redirecting...</div>;
}
