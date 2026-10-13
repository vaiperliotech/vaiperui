# Contributing to vaiperui

Thanks for taking the time to contribute! This guide covers how to set up the project, how we
work, and what we expect from a pull request.

By participating you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). To report a
security problem, read the [Security Policy](SECURITY.md) instead of opening an issue.

## Project structure

This is a [pnpm](https://pnpm.io) workspace managed with [Turborepo](https://turbo.build).

| Path                | What it is                                              |
| ------------------- | ------------------------------------------------------- |
| `packages/vaiperui` | The React component library published to npm            |
| `packages/config`   | Shared TypeScript configuration                         |
| `apps/web`          | The documentation site (Next.js, English/Portuguese/Spanish) |
| `apps/storybook`    | Storybook for developing components in isolation        |

## Getting started

Requirements: **Node.js 24+** and **pnpm 12** (the repository pins the exact pnpm version, so
pnpm downloads it for you).

To contribute you need to **fork** the repository; pull requests are opened from your fork, not
from a branch in this repository.

1. [Fork the repository](https://github.com/vaiperliotech/vaiperui/fork) on GitHub.
2. Clone **your fork** and add the original repository as `upstream`:

   ```bash
   git clone https://github.com/<your-username>/vaiperui.git
   cd vaiperui
   git remote add upstream https://github.com/vaiperliotech/vaiperui.git
   ```

3. Install the dependencies and start the project:

   ```bash
   pnpm install
   pnpm dev
   ```

`pnpm dev` starts the documentation site on <http://localhost:3000> and Storybook on
<http://localhost:6006>.

Keep your fork up to date before starting new work:

```bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
```

## Useful commands

Run them from the repository root:

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `pnpm lint`         | Lints every package with Biome        |
| `pnpm typecheck`    | Type-checks every package             |
| `pnpm test`         | Runs the unit tests (Vitest)          |
| `pnpm build`        | Builds every package                  |
| `pnpm format`       | Formats the code with Biome           |

To work on a single package, filter it: `pnpm --filter vaiperui test`.

## Making a change

1. **Open an issue first** for anything bigger than a small fix, so we can agree on the approach
   before you spend time on it.
2. Create a branch in your fork from an up-to-date `main` (for example `feat/select-flags`).
3. Make your change, keeping it focused: one topic per pull request.
4. Add or update **tests** for any behavior you change (`*.test.tsx` next to the component).
5. Update the **docs** when you change the public API: the props table and the examples live in
   `apps/web/src/data`, and the Storybook stories next to each component. The site is
   translated, so a text change goes in all three languages (`en`, `pt`, `es`).
6. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` and make sure everything passes.
7. Push the branch to your fork and open a pull request against `main` of
   `vaiperliotech/vaiperui`.

## Code style

- Code, comments and commit messages are written in **English**.
- Formatting and linting are handled by [Biome](https://biomejs.dev); run `pnpm format` before
  committing.
- Components must stay accessible: keyboard support, visible focus, correct roles and labels.
- Respect `prefers-reduced-motion` for any animation.

## Commit messages

We follow a Conventional Commits style with an emoji:

```text
<type>(<scope>): <description>

[optional body]
```

| Type       | Icon | Use it for                                          |
| ---------- | :--: | --------------------------------------------------- |
| `feat`     |  ✨  | A new user-facing feature                           |
| `fix`      |  🐛  | A bug fix                                           |
| `docs`     |  📚  | Documentation-only changes                          |
| `style`    |  💄  | Formatting or visual styling with no logic change   |
| `refactor` |  ♻️  | Code changes that neither fix a bug nor add a feature |
| `test`     |  🧪  | Adding or fixing tests                              |
| `chore`    |  🔧  | Maintenance, configuration, dependencies            |
| `perf`     |  ⚡  | Performance improvements                            |
| `ci`       |  🤖  | CI/CD files and scripts                             |
| `build`    |  📦  | Build system or external dependencies               |
| `revert`   |  ⏪  | Reverting a previous commit                         |

Example: `✨ feat(select): add noResultsMessage prop`

## Pull requests

- Open it from your fork's branch to `main` of `vaiperliotech/vaiperui`.
- Describe **what** changed and **why**, and link the related issue.
- Include screenshots or a short recording for visual changes.
- CI runs lint, typecheck, tests and build on every pull request. **A pull request whose checks
  fail is closed automatically**: fix the errors locally and open a new one.
- A maintainer reviews every pull request. Be ready to iterate on the feedback.

## Reporting bugs and requesting features

Open an [issue](https://github.com/vaiperliotech/vaiperui/issues). For a bug, include the
`vaiperui` version, your React and Tailwind versions, the browser, and a minimal reproduction.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
