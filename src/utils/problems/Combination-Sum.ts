import assert from "assert";
import { Problem } from "../types/problem";

export const combinationSum: Problem = {
	id: "combination-sum",
	title: "11. Combination Sum",
	problemStatement: `<p class='mt-3'>
  Given an array of <strong>distinct</strong> integers <code>candidates</code> and a target integer <code>target</code>, return a list of all unique combinations of <code>candidates</code> where the chosen numbers sum to <code>target</code>.
</p>
<p class='mt-3'>
  You may return the combinations in any order. The same number may be chosen from <code>candidates</code> an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.
</p>
<p class='mt-3'>
  It is guaranteed that the number of unique combinations that sum up to <code>target</code> is less than 150 for the given input.
</p>`,
	examples: [
		{
			id: 1,
			inputText: `2 3 6 7
7`,
			outputText: "[[7], [2,2,3]]",
			explanation: "The possible combinations are [7] and [2,2,3].",
		},
		{
			id: 2,
			inputText: `2 3 5
8`,
			outputText: "[[2,2,2,2], [2,3,3], [3,5]]",
			explanation: "The possible combinations are [2,2,2,2], [2,3,3], and [3,5].",
		},
	],
	constraints: `<li class='mt-2'><code>1 ≤ candidates.length ≤ 30</code></li>
<li class='mt-2'><code>1 ≤ candidates[i] ≤ 200</code></li>
<li class='mt-2'><code>1 ≤ target ≤ 500</code></li>`,
	order: 11,
};
