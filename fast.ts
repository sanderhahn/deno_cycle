const query = Deno.args[0];
if (query === undefined) {
  console.log("Please supply start as argument");
  Deno.exit(1);
}

const process = Deno.run({
  cmd: ["deno", "info", "--json", "--unstable", query],
  stdout: "piped",
});
const status = await process.status();
if (!status.success) {
  Deno.exit(status.code);
}

const decoder = new TextDecoder();
const stdout = await Deno.readAll(process.stdout);
const graph = JSON.parse(decoder.decode(stdout));

type GraphFiles = {
  [url: string]: {
    deps: string[];
  }
};
type Graph = {
  module: string;
  files: GraphFiles;
};

type Cycle = string[];

function cycles(
  graph: GraphFiles,
  visit: string,
  visited: { [name: string]: boolean },
  path: string[],
  agg: Cycle[],
) {
  const index = path.indexOf(visit);
  if (index >= 0) {
    agg.push(path.slice(index));
    return agg;
  }
  if (visited[visit]) {
    return agg;
  }
  path.push(visit);
  visited[visit] = true;
  const deps = graph[visit].deps;
  if (deps !== undefined) {
    for (const dep of deps) {
      agg = cycles(graph, dep, visited, [...path], agg);
    }
  }
  return agg;
}

const start = graph.module;
graph.files[start] = {
  deps: Object.keys(graph.files),
};

const agg: Cycle[] = [];
const analysis = cycles(graph.files, start, {}, [], agg);

console.log(`Analysis of ${start}`);
if (analysis.length > 0) {
  for (const entry of analysis) {
    console.log(entry.join(" -> "));
  }
  Deno.exit(1);
}
console.log("No import cycles");
Deno.exit(0);
