import assert from "assert";
import { Problem } from "../types/problem";

export const subsets: Problem = {
	id: "subsets",
	title: "14. Subsets",
	problemStatement: `<p class='mt-3'>
  Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set).
</p>
<p class='mt-3'>
  The solution set must not contain duplicate subsets. You may return the solution in any order.
</p>`,
	examples: [
		{
			id: 1,
			inputText: "1 2 3",
			outputText: "[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]",
			explanation: "All subsets of [1,2,3] are listed, including the empty set and the set itself.",
		},
	],
	constraints: `<li class='mt-2'><code>1 ≤ nums.length ≤ 10</code></li>
<li class='mt-2'><code>-10 ≤ nums[i] ≤ 10</code></li>
<li class='mt-2'>All elements in <code>nums</code> are unique.</li>`,
	order: 14,
};
