import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import { Problem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import MonacoEditor from "@monaco-editor/react";
import {
  arrayUnion,
  doc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  runTransaction,
  increment,
} from "firebase/firestore";

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
  contestId?: string; // contestId is optional
};

const Playground: React.FC<PlaygroundProps> = ({
  problem,
  setSuccess,
  setSolved,
  contestId,
}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [user] = useAuthState(auth);
  // Not using pid from router anymore; we use problem.id.
  const { query } = useRouter();
  const [language, setLanguage] = useState("cpp");

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit your code");
      return;
    }

    const languageMap: { [key: string]: number } = {
      javascript: 63,
      python: 71,
      java: 62,
      cpp: 54,
    };

    const languageId = languageMap[language];
    if (!languageId) {
      toast.error("Selected language not supported");
      return;
    }

    try {
      // Submit code to Judge0
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            source_code: userCode,
            language_id: languageId,
            stdin: problem.examples[activeTestCaseId].inputText,
            expected_output: problem.examples[activeTestCaseId].outputText,
          }),
        }
      );

      const { token } = await response.json();
      let result;
      while (true) {
        const resultRes = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        result = await resultRes.json();
        if (result.status.id >= 3) break;
        await new Promise((res) => setTimeout(res, 1000));
      }

      const submissionData = {
        userId: user.uid,
        problemId: problem.id,
        language,
        status: result.status.id === 3 ? "Accepted" : "Wrong Answer",
        code: userCode,
        timestamp: serverTimestamp(),
        ...(contestId ? { contestId } : {}), // include contestId if exists
      };

      // Debug: log submissionData before adding
      console.log("Submission Data:", submissionData);

      // Push submission to the appropriate collection:
      const collectionRef = collection(
        firestore,
        contestId ? "contestSubmissions" : "submissions"
      );
      await addDoc(collectionRef, submissionData);

      // If submission is accepted, update practice solved list
      if (result.status.id === 3) {
        toast.success("Congrats! All test cases passed!");

        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, {
          solvedProblems: arrayUnion(problem.id),
        });
        setSolved(true);

        // If in contest mode, update the contest leaderboard as well.
        if (contestId) {
          console.log("Updating contest leaderboard for contestId:", contestId);
          const scoreRef = doc(
            firestore,
            "contestLeaderboards",
            contestId,
            "scores",
            user.uid
          );

          await runTransaction(firestore, async (transaction) => {
            const docSnap = await transaction.get(scoreRef);

            if (docSnap.exists()) {
              const data = docSnap.data() as { solvedProblems?: string[] };
              const solvedProblems = data.solvedProblems || [];

              if (!solvedProblems.includes(problem.id)) {
                transaction.update(scoreRef, {
                  solvedProblems: arrayUnion(problem.id),
                  score: increment(100),
                  lastSubmissionTime: serverTimestamp(),
                });
              }
            } else {
              transaction.set(scoreRef, {
                userName: user.displayName || user.email || "Anonymous",
                solvedProblems: [problem.id],
                score: 100,
                lastSubmissionTime: serverTimestamp(),
              });
            }
          });
        }
      } else {
        toast.error(`Error: ${result.status.description}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const code = localStorage.getItem(`code-${problem.id}`);
    setUserCode(code ? JSON.parse(code) : "");
  }, [problem.id, user]);

  const onChange = (value: string | undefined) => {
    if (value !== undefined) {
      setUserCode(value);
      localStorage.setItem(`code-${problem.id}`, JSON.stringify(value));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-dark-layer-2">
      <PreferenceNav
        handleSubmit={handleSubmit}
        language={language}
        setLanguage={setLanguage}
      />

      <div className="flex flex-col h-[calc(100vh-106px)] overflow-hidden bg-dark-layer-2 gap-2">
        <div className="w-full h-[60%] overflow-y-scroll no-scrollbar py-2 px-4">
          <MonacoEditor
            height="100%"
            defaultLanguage="cpp"
            value={userCode}
            onChange={onChange}
            options={{
              fontSize: 13,
              theme: "vs-dark",
            }}
          />
        </div>
        <div className="w-full px-5 overflow-y-scroll h-[40%] no-scrollbar">
          <div className="flex items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center">
              <div className="font-medium leading-5 text-white">Testcases</div>
            </div>
          </div>

          <div className="flex">
            {problem.examples.map((example, index) => (
              <div
                className="mr-2 items-start mt-2"
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${
                      activeTestCaseId === index
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold my-4 flex gap-4">
            <div className="w-[60%]">
              <p className="text-sm font-medium mt-4 text-white">Input:</p>
              <div className="w-full h-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2 whitespace-pre-line">
                {problem.examples[activeTestCaseId].inputText}
              </div>
            </div>
            <div className="w-[40%]">
              <p className="text-sm font-medium mt-4 text-white">Output:</p>
              <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2 h-full whitespace-pre-line">
                {problem.examples[activeTestCaseId].outputText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
