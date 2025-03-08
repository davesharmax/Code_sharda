import assert from "assert";
import { Problem } from "../types/problem";

export const wordBreak: Problem = {
	id: "word-break",
	title: "16. Word Break",
	problemStatement: `<p class='mt-3'>
  Given a string <code>s</code> and a dictionary of words <code>wordDict</code>, determine if <code>s</code> can be segmented into a space-separated sequence of one or more dictionary words.
</p>
<p class='mt-3'>
  Note that the same word in the dictionary may be reused multiple times in the segmentation.
</p>`,
	examples: [
		{
			id: 1,
			inputText: `leetcode
leet code`,
			outputText: "true",
			explanation: "The string \"leetcode\" can be segmented as \"leet code\".",
		},
		{
			id: 2,
			inputText: `applepenapple
apple pen`,
			outputText: "true",
			explanation: "The string \"applepenapple\" can be segmented as \"apple pen apple\".",
		},
		{
			id: 3,
			inputText: `catsandog
cats dog sand and cat`,
			outputText: "false",
			explanation: "The string \"catsandog\" cannot be segmented into a sequence of dictionary words.",
		},
	],
	constraints: `<li class='mt-2'><code>1 ≤ s.length ≤ 300</code></li>
<li class='mt-2'><code>1 ≤ wordDict.length ≤ 1000</code></li>
<li class='mt-2'><code>1 ≤ wordDict[i].length ≤ 20</code></li>
<li class='mt-2'>All the strings in <code>wordDict</code> are unique.</li>`,
	order: 16,
};
