import assert from "assert";
import { Problem } from "../types/problem";

export const spiralMatrix: Problem = {
	id: "spiral-matrix",
	title: "8. Spiral Matrix",
	problemStatement: `<p class='mt-3'>
  Given an <code>m x n</code> matrix, return all elements of the matrix in spiral order.
</p>
<p class='mt-3'>
  The spiral order starts at the top-left corner and proceeds to the right, then down, left, and up, repeating this process until every element has been visited.
</p>`,
	examples: [
		{
			id: 1,
			inputText: `1 2 3
4 5 6
7 8 9`,
			outputText: "1 2 3 6 9 8 7 4 5",
			explanation: "The spiral order of the matrix is: 1 -> 2 -> 3 -> 6 -> 9 -> 8 -> 7 -> 4 -> 5.",
		},
		{
			id: 2,
			inputText: `1 2 3 4
5 6 7 8
9 10 11 12`,
			outputText: "1 2 3 4 8 12 11 10 9 5 6 7",
			explanation: "The spiral order of the matrix is: 1 -> 2 -> 3 -> 4 -> 8 -> 12 -> 11 -> 10 -> 9 -> 5 -> 6 -> 7.",
		},
	],
	constraints: `<li class='mt-2'><code>m == matrix.length</code></li>
<li class='mt-2'><code>n == matrix[i].length</code></li>
<li class='mt-2'><code>1 ≤ m, n ≤ 10</code></li>
<li class='mt-2'><code>-100 ≤ matrix[i][j] ≤ 100</code></li>`,
	order: 8,
};
