import assert from "assert";
import { Problem } from "../types/problem";

export const reverseLinkedList: Problem = {
	id: "reverse-linked-list",
	title: "5. Reverse Linked List",
	problemStatement: `<p class='mt-3'>
  Given the head of a singly linked list, reverse the list, and return the reversed list.
</p>
<p class='mt-3'>
  You must reverse the list in-place without allocating extra space for another list.
</p>`,
	examples: [
		{
			id: 1,
			inputText: `1 2 3 4 5`,
			outputText: `5 4 3 2 1`,
			explanation: "The list is reversed so that the head becomes the tail and vice versa.",
		},
		{
			id: 2,
			inputText: `1 2`,
			outputText: `2 1`,
			explanation: "Reversing a two-node list swaps their positions.",
		},
	],
	constraints: `<li class='mt-2'><code>0 ≤ number of nodes ≤ 5000</code></li>
<li class='mt-2'><code>-5000 ≤ Node.val ≤ 5000</code></li>`,
	order: 5,
};
