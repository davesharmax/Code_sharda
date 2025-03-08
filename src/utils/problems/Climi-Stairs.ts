import assert from "assert";
import { Problem } from "../types/problem";

export const climbingStairs: Problem = {
	id: "climbing-stairs",
	title: "10. Climbing Stairs",
	problemStatement: `<p class='mt-3'>
  You are climbing a staircase. It takes <code>n</code> steps to reach the top.
  Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
</p>`,
	examples: [
		{
			id: 1,
			inputText: "2",
			outputText: "2",
			explanation: "There are 2 distinct ways: 1+1 (two single steps) or 2 (one double step).",
		},
		{
			id: 2,
			inputText: "3",
			outputText: "3",
			explanation: "There are 3 distinct ways: 1+1+1, 1+2, or 2+1.",
		},
	],
	constraints: `<li class='mt-2'><code>1 ≤ n ≤ 45</code></li>`,
	order: 10,
};
