import assert from "assert";
import { Problem } from "../types/problem";

export const trappingRainWater: Problem = {
	id: "trapping-rain-water",
	title: "15. Trapping Rain Water",
	problemStatement: `<p class='mt-3'>
  Given an array of non-negative integers <code>height</code> where each element represents the elevation at that index, compute the total amount of rain water that can be trapped after raining.
</p>
<p class='mt-3'>
  The width of each bar is 1.
</p>`,
	examples: [
		{
			id: 1,
			inputText: "0 1 0 2 1 0 1 3 2 1 2 1",
			outputText: "6",
			explanation: "The elevation map traps 6 units of rain water.",
		},
		{
			id: 2,
			inputText: "4 2 0 3 2 5",
			outputText: "9",
			explanation: "The elevation map traps 9 units of rain water.",
		},
	],
	constraints: `<li class='mt-2'><code>n == height.length</code></li>
<li class='mt-2'><code>0 ≤ n ≤ 3 * 10^4</code></li>
<li class='mt-2'><code>0 ≤ height[i] ≤ 10^5</code></li>`,
	order: 15,
};
