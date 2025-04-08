"use client";

import { useState } from "react";
import { firestore, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

const CreateContest = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const [contestData, setContestData] = useState({
    name: "",
    startTime: "",
    duration: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [questionTitles, setQuestionTitles] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContestData({ ...contestData, [e.target.name]: e.target.value });
  };

  const handleQuestionIdChange = async (index: number, value: string) => {
    const updatedIds = [...questionIds];
    updatedIds[index] = value;
    setQuestionIds(updatedIds);

    if (value.trim() !== "") {
      try {
        const questionDoc = await getDoc(doc(firestore, "questions", value));
        if (questionDoc.exists()) {
          const title = questionDoc.data().title;
          const updatedTitles = [...questionTitles];
          updatedTitles[index] = title;
          setQuestionTitles(updatedTitles);
        } else {
          const updatedTitles = [...questionTitles];
          updatedTitles[index] = "Not Found";
          setQuestionTitles(updatedTitles);
        }
      } catch (err) {
        console.error("Error fetching question:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !contestData.name ||
      !contestData.startTime ||
      !contestData.duration
    ) {
      setError("All fields are required.");
      return;
    }

    if (
      isNaN(Number(contestData.duration)) ||
      Number(contestData.duration) <= 0
    ) {
      setError("Duration must be a positive number.");
      return;
    }

    if (
      questionIds.length === 0 ||
      questionIds.some((id) => id.trim() === "")
    ) {
      setError("Please provide valid Question IDs.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const usersRef = collection(firestore, "users");
      const userDocs = await getDocs(usersRef);
      const currentUser = userDocs.docs.find((doc) => doc.id === user?.uid);

      if (!currentUser || currentUser.data().role !== "faculty") {
        setError("You are not authorized to create a contest.");
        return;
      }

      await addDoc(collection(firestore, "contests"), {
        name: contestData.name,
        startTime: new Date(contestData.startTime).toISOString(),
        duration: Number(contestData.duration),
        description: contestData.description,
        createdBy: user?.uid,
        questionIds: questionIds,
      });

      alert("Contest Created Successfully!");
      router.push("/contests");
    } catch (err) {
      setError("Error creating contest. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 bg-dark-layer-2 min-h-screen overflow-auto">

      <div className="w-[50%] mx-auto">
        <h2 className="text-2xl text-white font-bold text-center mb-6">
          Create Contest
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white">Contest Name</label>
            <input
              type="text"
              name="name"
              value={contestData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-white">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={contestData.startTime}
              onChange={handleChange}
              className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-white">
              Duration (in minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={contestData.duration}
              onChange={handleChange}
              className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-white">Description (Optional)</label>
            <textarea
              name="description"
              value={contestData.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-white">
              Number of Questions in Contest
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={numberOfQuestions}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                if (!isNaN(num) && num >= 0 && num <= 20) {
                  setNumberOfQuestions(num);
                  setQuestionIds(new Array(num).fill(""));
                  setQuestionTitles(new Array(num).fill(""));
                }
              }}
              className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
            />
          </div>

          {questionIds.map((id, index) => (
            <div key={index} className="flex flex-col gap-1">
              <label className="text-white">Question ID #{index + 1}</label>
              <input
                type="text"
                value={id}
                onChange={(e) =>
                  handleQuestionIdChange(index, e.target.value)
                }
                className="w-full p-2 rounded bg-dark-fill-3 text-white border border-gray-600"
              />
              {questionTitles[index] && (
                <p className="text-sm text-green-400">
                  Title: {questionTitles[index]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-brand-orange text-white py-2 rounded hover:bg-orange-500"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Contest"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateContest;
