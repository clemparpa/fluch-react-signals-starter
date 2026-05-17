# Security Policy

## Supported versions

This project is a **template repository**. Only the `main` branch (HEAD) is supported. There are no long-term support branches and no backports — forks are expected to track `main` or stay pinned to a tagged release (see [CHANGELOG.md](CHANGELOG.md) once published).

| Version       | Supported          |
| ------------- | ------------------ |
| `main` (HEAD) | :white_check_mark: |
| Older tags    | :x:                |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security reports.**

Use **GitHub Private Vulnerability Reporting** instead:

→ [Report a vulnerability](https://github.com/clemparpa/fluch-react-signals-starter/security/advisories/new)

This opens a private advisory that only the maintainer can see. Public disclosure is coordinated after a fix is available.

### What to include

- A description of the issue and its impact.
- Steps to reproduce (minimal repro is ideal).
- The affected commit SHA or tag.
- Your environment (Node version, pnpm version, OS) if relevant.
- Any suggested mitigation, if you have one.

### Response targets

These are indicative, not contractual — this is a community-maintained template, not a funded product.

| Stage                       | Target            |
| --------------------------- | ----------------- |
| Acknowledgement of report   | within **7 days** |
| Initial triage & severity   | within 14 days    |
| Fix or mitigation published | depends on scope  |

### Out of scope

- Vulnerabilities in **dependencies** that have no impact on this template's surface area. These should be reported to the dependency maintainers directly. (This repo does run `pnpm audit --audit-level=high` on every CI run, so high-severity dep advisories are surfaced automatically.)
- Issues affecting only outdated forks that have not pulled from `main`.
- Theoretical issues without a demonstrated impact.

## Contact

Security reports must go through GitHub Private Vulnerability Reporting (link above). No email address is published for security correspondence. If PVR is temporarily unavailable, mention the maintainer ([@clemparpa](https://github.com/clemparpa)) in a private channel to coordinate an alternate route.
