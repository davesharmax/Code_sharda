import assert from "assert";
import { Problem } from "../types/problem";

export const search2DMatrix: Problem = {
	id: "search-2d-matrix",
	title: "7. Search a 2D Matrix",
	problemStatement: `<p class='mt-3'>
  Given an <code>m x n</code> matrix where each row is sorted in ascending order and the first integer of each row is greater than the last integer of the previous row, write an efficient algorithm to search for a target value in the matrix.
</p>
<p class='mt-3'>
  Return <code>true</code> if the target is found in the matrix, otherwise return <code>false</code>.
</p>`,
	examples: [
		{
			id: 1,
			inputText: `1 3 5 7
10 11 16 20
23 30 34 60
---
3`,
			outputText: "true",
			explanation: "The target value 3 exists in the matrix.",
		},
		{
			id: 2,
			inputText: `1 3 5 7
10 11 16 20
23 30 34 60
---
13`,
			outputText: "false",
			explanation: "The target value 13 is not present in the matrix.",
		},
	],
	constraints: `<li class='mt-2'><code>m == matrix.length</code></li>
<li class='mt-2'><code>n == matrix[i].length</code></li>
<li class='mt-2'><code>1 ≤ m, n ≤ 100</code></li>
<li class='mt-2'><code>-10^4 ≤ matrix[i][j], target ≤ 10^4</code></li>`,
	order: 7,
};
