# deno cycle

Analyse source import dependencies into a graph and detect import cycles.

## Fast version

Uses output of `deno info` to get a graph of dependencies using the local cache.
The visiting order is not stable and separate runs might generate different cycles.

```
deno run --allow-run fast.ts https://deno.land/x/oak@v6.3.1/mod.ts

Analysis of https://deno.land/x/oak@v6.3.1/mod.ts
https://deno.land/std@0.73.0/http/_io.ts -> https://deno.land/std@0.73.0/http/server.ts
https://deno.land/std@0.73.0/path/glob.ts -> https://deno.land/std@0.73.0/path/mod.ts
https://deno.land/x/oak@v6.3.1/application.ts -> https://deno.land/x/oak@v6.3.1/context.ts -> https://deno.land/x/oak@v6.3.1/server_sent_event.ts
https://deno.land/x/oak@v6.3.1/context.ts -> https://deno.land/x/oak@v6.3.1/send.ts
https://deno.land/x/oak@v6.3.1/application.ts -> https://deno.land/x/oak@v6.3.1/context.ts
https://deno.land/x/oak@v6.3.1/application.ts -> https://deno.land/x/oak@v6.3.1/middleware.ts
https://deno.land/x/oak@v6.3.1/mod.ts
```

## Slow version

Parsing is done using [deno_swc](https://github.com/nestdotland/deno_swc) and [swc](https://github.com/swc-project/swc).

```
deno run --allow-read --allow-net cycle.ts https://deno.land/x/oak@v6.3.1/mod.ts

Analysis of https://deno.land/x/oak@v6.3.1/mod.ts
https://deno.land/x/oak@v6.3.1/application.ts -> https://deno.land/x/oak@v6.3.1/context.ts
https://deno.land/std@0.73.0/http/server.ts -> https://deno.land/std@0.73.0/http/_io.ts
https://deno.land/std@0.73.0/path/mod.ts -> https://deno.land/std@0.73.0/path/glob.ts
https://deno.land/x/oak@v6.3.1/context.ts -> https://deno.land/x/oak@v6.3.1/send.ts
https://deno.land/x/oak@v6.3.1/application.ts -> https://deno.land/x/oak@v6.3.1/context.ts -> https://deno.land/x/oak@v6.3.1/server_sent_event.ts
https://deno.land/x/oak@v6.3.1/application.ts -> https://deno.land/x/oak@v6.3.1/middleware.ts
```
