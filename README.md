# Initial setup

```bash
pnpm i
pnpm build
```

# To add a new document model and editor

Put your document model code in `/document-models/` following the existing pattern for document models.

Add `export { module as YourModelName } from "./your-model-name-directory";` to `/document-models/index.ts`.

Add your editor code in `/editors/` following the existing pattern for editors.

Add `export { module as YourEditorName } from "./your-editor-name-directory";` to `/editors/index.ts`.

# Testing

```bash
pnpm test
```

should run your tests and they should pass.

```bash
pnpm build
```

should run the `generate` script and build your project.

```bash
pnpm storybook
```

should run the `storybook` script and open the storybook UI. You should see your editor in the storybook UI.

# NOTE

You may see build and lint errors and failing tests for other document models and editors. You can ignore these errors, since they should be rectified by the people working on the document models and editors.