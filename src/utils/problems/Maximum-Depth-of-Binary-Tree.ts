import assert from "assert";
import { Problem } from "../types/problem";

export const maximumDepthBinaryTree: Problem = {
	id: "maximum-depth-of-binary-tree",
	title: "3. Maximum Depth of Binary Tree",
	problemStatement: `<p class='mt-3'>
  Given the <code>root</code> of a binary tree, return its maximum depth.
</p>
<p class='mt-3'>
  The maximum depth is defined as the number of nodes along the longest path from the root node down to the farthest leaf node.
</p>`,
	examples: [
		{
			id: 1,
			inputText: `3 9 20 null null 15 7`,
			outputText: "3",
			explanation: "The tree has a maximum depth of 3.",
		},
		{
			id: 2,
			inputText: `1 null 2`,
			outputText: "2",
			explanation: "The tree has two levels, so its maximum depth is 2.",
		},
	],
	constraints: `<li class='mt-2'><code>The number of nodes in the tree is in the range [0, 10^4]</code></li>
<li class='mt-2'><code>-100 ≤ Node.val ≤ 100</code></li>`,
	order: 3,
};
