import assert from "node:assert/strict";
import test from "node:test";

const availabilityModule = new URL("./availability.ts", import.meta.url);
const { generateAvailability } = (await import(availabilityModule.href)) as typeof import("./availability");

test("availability excludes elapsed Sydney times", () => {
  const duringWorkday = generateAvailability(new Date("2026-07-10T05:30:00.000Z"), 2);
  assert.equal(duringWorkday[0].dateISO, "2026-07-10");
  assert.deepEqual(
    duringWorkday[0].slots.map((slot) => slot.booked),
    [true, true, true, true, false]
  );

  const afterWorkday = generateAvailability(new Date("2026-07-10T07:00:00.000Z"), 2);
  assert.equal(afterWorkday[0].dateISO, "2026-07-13");
});
