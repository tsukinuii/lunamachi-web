# Feature Structure

Each feature keeps its business-specific code together.

Use this shape for new features:

```txt
features/example/
  example.types.ts
  example.service.ts
  example.client.ts
  useExample.ts
  components/
    ExampleCard.tsx
    ExampleGrid.tsx
```

- `*.types.ts`: shared types for the feature.
- `*.service.ts`: server-side data fetching for SEO-friendly pages.
- `*.client.ts`: browser-side calls to `/api/...` BFF routes.
- `use*.ts`: client hooks for loading/error/state.
- `components/`: UI components that belong only to this feature.
