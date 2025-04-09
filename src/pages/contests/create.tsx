"use client";

import { useState } from "react";
import { firestore, auth } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

interface ContestFormData {
  name: string;
  startTime: string;
  duration: number; // in minutes
  problemIds: string; // comma separated values
}

const CreateContest = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState<ContestFormData>({
    name: "",
    startTime: "",
    duration: 0,
    problemIds: "",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Ensure the user is authenticated
    if (!user) {
      setErrorMsg("You must be logged in to create a contest.");
      return;
    }

    // Optionally check for a faculty role if using custom claims
    // If you are not setting custom claims, comment out this block
    // if (!(user as any)?.token?.role || (user as any).token.role !== "faculty") {
    //   setErrorMsg("Only faculty members are allowed to create contests.");
    //   return;
    // }

    const contestData = {
      name: formData.name,
      startTime: formData.startTime,
      duration: formData.duration,
      problemIds: formData.problemIds.split(",").map((id) => id.trim()),
      createdBy: user.uid,
      status: "active",
    };

    try {
      await addDoc(collection(firestore, "contests"), contestData);
      router.push("/contests");
    } catch (error: any) {
      console.error("Error creating contest:", error);
      // Check if the error is related to permissions
      if (error.code === "permission-denied") {
        setErrorMsg("Insufficient permissions to create contest. Please contact an administrator.");
      } else {
        setErrorMsg("An error occurred while creating the contest.");
      }
    }
  };

  return (
    <div className="px-48 p-6 bg-dark-layer-1 w-full h-screen text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Create a New Contest</h2>
      {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        <div>
          <label className="block mb-1">Contest Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-dark-layer-2 border border-gray-700"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full p-2 rounded bg-dark-layer-2 border border-gray-700"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-2 rounded bg-dark-layer-2 border border-gray-700"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Problem IDs (comma separated)</label>
          <textarea
            name="problemIds"
            value={formData.problemIds}
            onChange={handleChange}
            className="w-full p-2 rounded bg-dark-layer-2 border border-gray-700"
            placeholder="e.g., prob1, prob2, prob3"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Contest
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContest;
