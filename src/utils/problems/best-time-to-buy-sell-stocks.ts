import assert from "assert";
import { Problem } from "../types/problem";

export const bestTimeToBuySellStock: Problem = {
	id: "best-time-to-buy-sell-stock",
	title: "9. Best Time to Buy and Sell Stock",
	problemStatement: `<p class='mt-3'>
  Given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <em>i-th</em> day, determine the maximum profit you can achieve by buying on one day and selling on a later day.
</p>
<p class='mt-3'>
  If no profit can be achieved, return <code>0</code>.
</p>`,
	examples: [
		{
			id: 1,
			inputText: "7 1 5 3 6 4",
			outputText: "5",
			explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6) for a profit of 6 - 1 = 5.",
		},
		{
			id: 2,
			inputText: "7 6 4 3 1",
			outputText: "0",
			explanation: "No profit can be made, so the maximum profit is 0.",
		},
	],
	constraints: `<li class='mt-2'><code>1 ≤ prices.length ≤ 10^5</code></li>
<li class='mt-2'><code>0 ≤ prices[i] ≤ 10^4</code></li>`,
	order: 9,
};
