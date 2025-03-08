import assert from "assert";
import { Problem } from "../types/problem";

export const validParentheses: Problem = {
	id: "valid-parentheses",
	title: "4. Valid Parentheses",
	problemStatement: `<p class='mt-3'>
  Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.
</p>
<p class='mt-3'>
  An input string is valid if:
</p>
<ul class='mt-3'>
  <li>Open brackets must be closed by the same type of brackets.</li>
  <li>Open brackets must be closed in the correct order.</li>
</ul>
<p class='mt-3'>An empty string is also considered valid.</p>`,
	examples: [
		{
			id: 1,
			inputText: "()",
			outputText: "true",
			explanation: "The string \"()\" is a valid set of parentheses.",
		},
		{
			id: 2,
			inputText: "()[]{}",
			outputText: "true",
			explanation: "The string contains multiple types of validly closed brackets.",
		},
		{
			id: 3,
			inputText: "(]",
			outputText: "false",
			explanation: "The string \"(]\" is not valid because the brackets do not match.",
		},
	],
	constraints: `<li class='mt-2'><code>0 ≤ s.length ≤ 10^4</code></li>
<li class='mt-2'><code>s[i]</code> is one of <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code>, or <code>']'</code></li>`,
	order: 4,
};
