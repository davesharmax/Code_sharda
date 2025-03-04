
import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";

export default function Practice() {
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  // Prevent rendering until auth check is complete
  if (loading || (!loading && !user)) return null;

  return (
    <>
      <main className="bg-dark-layer-2 h-[calc(100vh-60px)] overflow-auto">
        <div className="relative overflow-x-auto mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Problem List</h1>

          {loadingProblems && (
            <div className="max-w-[1500px] mx-auto sm:w-7/12 w-full animate-pulse">
              {[...Array(10)].map((_, idx) => (
                <LoadingSkeleton key={idx} />
              ))}
            </div>
          )}
          <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-9/12 w-full max-w-[1500px] mx-auto">
            {!loadingProblems && (
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b">
                <tr>
                  <th scope="col" className="px-1 py-3 w-0 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Category
                  </th>
                </tr>
              </thead>
            )}
            <ProblemsTable setLoadingProblems={setLoadingProblems} />
          </table>
        </div>
      </main>
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-12 mt-4 px-6">
      <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
