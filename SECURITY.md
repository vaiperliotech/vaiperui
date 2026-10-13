# Security Policy

## Supported versions

vaiperui is in beta. Only the latest published version receives security fixes.

| Version             | Supported |
| ------------------- | :-------: |
| 1.0.0-beta (latest) |    ✅     |
| Older versions      |    ❌     |

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report it privately through GitHub's private vulnerability reporting:

1. Go to the [Security tab](https://github.com/vaiperliotech/vaiperui/security) of the repository.
2. Click **Report a vulnerability**, or open
   [a new advisory](https://github.com/vaiperliotech/vaiperui/security/advisories/new) directly.

Include as much of the following as you can:

- The affected version and the component (`Button`, `Input`, `Select`, the docs site…).
- A description of the issue and its impact.
- Steps to reproduce, or a minimal proof of concept.
- Any suggested fix or mitigation.

## What to expect

- We acknowledge your report within **3 business days**.
- We keep you updated while we investigate and work on a fix.
- Once a fix is released we publish a security advisory and credit you, unless you prefer to stay
  anonymous.

Please give us a reasonable amount of time to release a fix before disclosing the issue publicly.

## Scope

In scope: the `vaiperui` package published on npm and the documentation site in `apps/web`.

Out of scope: vulnerabilities in third-party dependencies (report them to the upstream project;
tell us if vaiperui needs a version bump), and issues that require a compromised development
environment.
