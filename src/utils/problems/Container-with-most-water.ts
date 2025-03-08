import assert from "assert";
import { Problem } from "../types/problem";

export const containerWithMostWater: Problem = {
	id: "container-with-most-water",
	title: "13. Container With Most Water",
	problemStatement: `<p class='mt-3'>
  Given an array of non-negative integers <code>heights</code> where each element represents the height of a vertical line at that index, find two lines that together with the x-axis form a container that holds the most water.
</p>
<p class='mt-3'>
  Return the maximum amount of water that can be contained.
</p>`,
	examples: [
		{
			id: 1,
			inputText: "1 8 6 2 5 4 8 3 7",
			outputText: "49",
			explanation: "The container formed between the lines at index 1 and index 8 holds 49 units of water.",
		},
		{
			id: 2,
			inputText: "1 1",
			outputText: "1",
			explanation: "The only two lines form a container that holds 1 unit of water.",
		},
	],
	constraints: `<li class='mt-2'><code>2 ≤ heights.length ≤ 10^5</code></li>
<li class='mt-2'><code>0 ≤ heights[i] ≤ 10^4</code></li>`,
	order: 13,
};
