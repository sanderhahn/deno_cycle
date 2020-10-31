# deno cycle

Analyse source import dependencies into a graph and detect import cycles.
Parsing is done using [deno_swc](https://github.com/nestdotland/deno_swc) and [swc](https://github.com/swc-project/swc).

```bash
deno run --allow-read --allow-net cycle.ts https://deno.land/x/oak/mod.ts

Analysis of https://deno.land/x/oak/mod.ts
https://deno.land/x/oak/application.ts -> https://deno.land/x/oak/middleware.ts
https://deno.land/x/oak/context.ts -> https://deno.land/x/oak/send.ts
https://deno.land/std@0.73.0/http/server.ts -> https://deno.land/std@0.73.0/http/_io.ts
https://deno.land/std@0.73.0/path/mod.ts -> https://deno.land/std@0.73.0/path/glob.ts
```
