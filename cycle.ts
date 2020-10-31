import { graph } from "./deps.ts";

const start = Deno.args[0];
if (start === undefined) {
  console.log("Please supply start as argument");
  Deno.exit(1);
}

const deps = await graph(start);
console.log(`Analysis of ${start}`);
let hasCycle = false;
for (const entry of Object.values(deps)) {
  if (entry.cycle) {
    console.log(entry.cycle.join(" -> "));
    hasCycle = true;
  }
}
if (hasCycle) {
  Deno.exit(1);
}
console.log("No import cycles");
Deno.exit(0);
