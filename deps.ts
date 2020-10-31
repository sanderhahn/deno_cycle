import { parse } from "https://raw.githubusercontent.com/nestdotland/deno_swc/master/mod.ts";

import {
  ModuleItem,
  Program,
  Statement,
} from "https://raw.githubusercontent.com/nestdotland/deno_swc/master/types/options.ts";

/**
 * Analyses dependencies of source imports
 * @param source source code
 */

export function deps(source: string): string[] {
  const ast: Program = parse(source, { syntax: "typescript" });
  const deps: string[] = [];
  let item: ModuleItem | Statement;
  for (item of ast.body) {
    switch (item.type) {
      // ModuleDeclaration
      case "ImportDeclaration":
      case "ExportAllDeclaration": {
        const source = item.source.value;
        if (!deps.includes(source)) {
          deps.push(source);
        }
        break;
      }
      case "ExportNamedDeclaration": {
        if (item.source) {
          const source = item.source.value;
          if (!deps.includes(source)) {
            deps.push(source);
          }
        }
        break;
      }

      // ModuleDeclaration
      case "ExportDeclaration":
      case "ExportDefaultDeclaration":
      case "ExportDefaultExpression":
      case "TsImportEqualsDeclaration":
      case "TsExportAssignment":
      case "TsNamespaceExportDeclaration":

      // Statement
      case "ExpressionStatement":
      case "BlockStatement":
      case "EmptyStatement":
      case "DebuggerStatement":
      case "WithStatement":
      case "ReturnStatement":
      case "LabeledStatement":
      case "BreakStatement":
      case "ContinueStatement":
      case "IfStatement":
      case "SwitchStatement":
      case "ThrowStatement":
      case "TryStatement":
      case "WhileStatement":
      case "DoWhileStatement":
      case "ForStatement":
      case "ForInStatement":
      case "ForOfStatement":

      // Declaration
      case "ClassDeclaration":
      case "FunctionDeclaration":
      case "VariableDeclaration":
      case "TsInterfaceDeclaration":
      case "TsTypeAliasDeclaration":
      case "TsEnumDeclaration":
      case "TsModuleDeclaration":
        break;

      default: {
        const never: never = item;
        throw Error(`unreachable ${never}`);
      }
    }
  }
  return deps;
}

/**
 * Read file or url
 * @param url input
 */

export async function readFileOrURL(url: URL): Promise<string> {
  if (url.protocol === "file:") {
    return Deno.readTextFile(url.pathname);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`unable to read ${url}`);
  }
  return response.text();
}

type GraphEntry = {
  filename: string;
  url: string;
  deps: string[];
  path?: string[];
  cycle?: string[];
};

type Graph = { [url: string]: GraphEntry };

async function recurseGraph(
  filename: string,
  base: URL,
  agg: Graph,
  path: string[],
) {
  const url = new URL(filename, base);
  const key = url.toString();

  if (agg[key] !== undefined) {
    const index = path.indexOf(key);
    if (index >= 0) {
      agg[key].cycle = path.slice(index);
    }
    return agg;
  }
  console.error(key);
  path.push(key);

  const source = await readFileOrURL(url);
  const sourceDeps = deps(source);

  const entry: GraphEntry = {
    filename,
    url: key,
    deps: sourceDeps,
    path,
  };
  agg[entry.url] = entry;

  for (const dep of entry.deps) {
    await recurseGraph(dep, url, agg, [...path]);
  }
  return agg;
}

/**
 * Analysis of import dependencies into graph
 * @param filename start filename or url
 * @param base optional base url
 */

export async function graph(filename: string, base?: URL) {
  if (base === undefined) {
    base = new URL(`file://${Deno.cwd()}/`);
  }
  const graph = await recurseGraph(filename, base, {}, []);
  for (const [_url, entry] of Object.entries(graph)) {
    delete (entry.path);
  }
  return graph;
}
