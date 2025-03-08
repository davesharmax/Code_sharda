import assert from "assert";
import { Problem } from "../types/problem";

export const jumpGame: Problem = {
	id: "jump-game",
	title: "6. Jump Game",
	problemStatement: `<p class='mt-3'>
  Given an array of non-negative integers <code>nums</code>, where each element represents your maximum jump length at that position, determine if you can reach the last index.
</p>
<p class='mt-3'>
  You are initially positioned at the first index of the array. Return <code>true</code> if you can reach the last index, otherwise return <code>false</code>.
</p>`,
	examples: [
		{
			id: 1,
			inputText: "2 3 1 1 4",
			outputText: "true",
			explanation: "Jump from index 0 to 1, then jump from index 1 to the last index.",
		},
		{
			id: 2,
			inputText: "3 2 1 0 4",
			outputText: "false",
			explanation: "You will always arrive at index 3, but its value is 0, which means you cannot move further.",
		},
	],
	constraints: `<li class='mt-2'><code>1 ≤ nums.length ≤ 10^4</code></li>
<li class='mt-2'><code>0 ≤ nums[i] ≤ 10^5</code></li>`,
	order: 6,
};
