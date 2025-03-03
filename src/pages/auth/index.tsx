import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";

const AuthPage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/practice");
    }
  }, [user, router]);

  if (loading) return null;

  return <div>Redirecting...</div>;
};

export default AuthPage;
