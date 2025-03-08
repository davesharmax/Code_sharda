import assert from "assert";
import { Problem } from "../types/problem";

export const mergeIntervals: Problem = {
	id: "merge-intervals",
	title: "2. Merge Intervals",
	problemStatement: `<p class='mt-3'>
  Given an array of intervals where each interval is represented as <code>[start, end]</code>, merge all overlapping intervals and return an array of the merged intervals.
</p>
<p class='mt-3'>
  The intervals can be provided in any order. The merged intervals should be returned in ascending order.
</p>`,
	examples: [
		{
			id: 1,
			inputText: `1 3
2 6
8 10
15 18`,
			outputText: `1 6
8 10
15 18`,
			explanation: "Intervals [1,3] and [2,6] overlap, so they are merged into [1,6].",
		},
		{
			id: 2,
			inputText: `1 4
4 5`,
			outputText: "1 5",
			explanation: "Intervals [1,4] and [4,5] are considered overlapping and merged into [1,5].",
		},
	],
	constraints: `<li class='mt-2'><code>1 ≤ intervals.length ≤ 10^4</code></li>
<li class='mt-2'><code>0 ≤ intervals[i][0] ≤ intervals[i][1] ≤ 10^4</code></li>`,
	order: 2,
};
