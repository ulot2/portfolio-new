// Checks the GitHub contributions page parser against a sample in the shape
// GitHub serves. Run: npx tsx scripts/check-contributions.ts
import assert from "node:assert/strict";
import { parseContributionsPage } from "../src/lib/contributions";

const page = `
<table class="ContributionCalendar-grid js-calendar-graph-table"><tbody>
<tr style="height: 10px">
  <td tabindex="0" data-ix="0" aria-selected="false" aria-describedby="contribution-graph-legend-level-0" style="width: 10px" data-date="2025-11-09" id="contribution-day-component-0-0" data-level="0" role="gridcell" data-view-component="true" class="ContributionCalendar-day"></td>
  <tool-tip id="tooltip-1" for="contribution-day-component-0-0" popover="manual" data-direction="n" data-type="label" data-view-component="true" class="sr-only position-absolute">No contributions on November 9th.</tool-tip>
  <td tabindex="0" data-ix="1" style="width: 10px" data-date="2025-11-16" id="contribution-day-component-0-1" data-level="2" role="gridcell" class="ContributionCalendar-day"></td>
  <tool-tip id="tooltip-2" for="contribution-day-component-0-1" popover="manual" class="sr-only position-absolute">1,204 contributions on November 16th.</tool-tip>
</tr>
<tr>
  <td tabindex="0" data-ix="0" data-date="2025-11-10" id="contribution-day-component-1-0" data-level="1" class="ContributionCalendar-day"></td>
  <tool-tip for="contribution-day-component-1-0" class="sr-only">1 contribution on November 10th.</tool-tip>
</tr>
</tbody></table>`;

const { days, exact } = parseContributionsPage(page);
assert.equal(exact, true);
assert.deepEqual(days, [
  { date: "2025-11-09", count: 0 },
  { date: "2025-11-10", count: 1 },
  { date: "2025-11-16", count: 1204 },
]);

// Without tooltips, the shading level stands in and the total is marked inexact.
const bare = parseContributionsPage(page.replace(/<tool-tip[\s\S]*?<\/tool-tip>/g, ""));
assert.equal(bare.exact, false);
assert.deepEqual(bare.days.map((d) => d.count), [0, 1, 2]);

console.log("contributions parser: ok");
