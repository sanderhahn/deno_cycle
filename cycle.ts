import { graph } from "./deps.ts";

const start = Deno.args[0];
if (start === undefined) {
  console.log("Please supply start as argument");
  Deno.exit(1);
}

const {cycles} = await graph(start);
console.log(`Analysis of ${start}`);
for (const cycle of cycles) {
  console.log(cycle.join(" -> "));
}
if (cycles.length > 0) {
  Deno.exit(1);
}
console.log("No import cycles");
Deno.exit(0);
