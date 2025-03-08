import assert from "assert";
import { Problem } from "../types/problem";

export const combinationSumII: Problem = {
	id: "combination-sum",
	title: "12. Combination Sum II",
	problemStatement: `<p class='mt-3'>
  Given a collection of candidate numbers (<code>candidates</code>) that might contain duplicates and a target number (<code>target</code>), find all unique combinations in <code>candidates</code> where the candidate numbers sum to <code>target</code>.
</p>
<p class='mt-3'>
  Each number in <code>candidates</code> may only be used once in the combination.
</p>
<p class='mt-3'>
  The solution set must not contain duplicate combinations. You may return the answer in any order.
</p>`,
	examples: [
		{
			id: 1,
			inputText: `10 1 2 7 6 1 5
8`,
			outputText: "[[1,1,6],[1,2,5],[1,7],[2,6]]",
			explanation: "The candidate set [10,1,2,7,6,1,5] with target 8 gives unique combinations after accounting for duplicates.",
		},
		{
			id: 2,
			inputText: `2 5 2 1 2
5`,
			outputText: "[[1,2,2],[5]]",
			explanation: "After considering duplicates, the unique combinations that sum to 5 are [1,2,2] and [5].",
		},
	],
	constraints: `<li class='mt-2'><code>1 ≤ candidates.length ≤ 100</code></li>
<li class='mt-2'><code>1 ≤ candidates[i] ≤ 50</code></li>
<li class='mt-2'><code>1 ≤ target ≤ 100</code></li>`,
	order: 12,
};
