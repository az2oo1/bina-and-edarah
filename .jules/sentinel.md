## Date: 2025-03-05
**Vulnerability:** SQL Injection in Settings Update via raw SQL fallback.
**Learning:** `prisma.$executeRawUnsafe` interpolates raw strings directly into the query execution, leaving it vulnerable to injection if the strings include unescaped malicious payloads. Even basic replacement `val.replace(/'/g, "''")` is brittle.
**Prevention:** Use `prisma.$executeRaw` alongside `Prisma.sql` to leverage native database parameterized queries. For column names which cannot be parameterized, strictly validate the name against an alphanumeric whitelist before injection using `Prisma.raw(field)`.
## 2025-03-05 - Critical Authentication Bypass and Secret Exposure
**Vulnerability:** A hardcoded `JWT_SECRET` was present in `server.ts` making all JWTs forgeable if `process.env.JWT_SECRET` wasn't set. Additionally, there was an unconditional hardcoded backdoor for user `admin:admin` that granted full administrator access regardless of the database state.
**Learning:** Hardcoded credentials and secrets as fallbacks in production-ready files pose an immense risk. The `admin:admin` fallback overrode normal database lookups, providing a permanent backdoor to anyone who checked the source code or guessed default credentials. Using a hardcoded JWT secret is equally dangerous since an attacker could forge tokens with any permission level.
**Prevention:** Never use predictable or hardcoded secrets as fallbacks in code. Always generate secure random fallbacks (e.g. `crypto.randomBytes()`) for required cryptography keys, and never implement credentials logic that unconditionally bypasses database lookup.
## 2024-05-18 - SQL Injection via Unsafe Prisma Raw Query
**Vulnerability:** SQL Injection in Admin Update via raw SQL fallback using `prisma.$executeRawUnsafe`.
**Learning:** String concatenation inside `prisma.$executeRawUnsafe` permits attackers to execute arbitrary SQL commands if the parameters aren't strictly sanitized.
**Prevention:** Always use `prisma.$executeRaw` alongside tagged template literals (e.g. ``prisma.$executeRaw`UPDATE Table SET col = ${val}` ``) for dynamic SQL queries to benefit from Prisma's automatic parameterization, or use Prisma Client operations wherever possible.
## 2026-07-11 - XSS Vulnerability in dangerouslySetInnerHTML
**Vulnerability:** XSS vulnerability in AdminCallbacks page due to unsanitized dangerouslySetInnerHTML.
**Learning:** Raw input being passed to dangerouslySetInnerHTML is a security risk as it executes potentially malicious user inputs directly.
**Prevention:** Always use a sanitation library like DOMPurify when passing user generated HTML data into dangerouslySetInnerHTML.
## 2025-03-05 - Path Traversal in Settings Logo Retrieval
**Vulnerability:** The `/settings-logo.png` endpoint in `server.ts` suffered from a Local File Inclusion / Path Traversal vulnerability because it trusted the `settings.logoUrl` database entry to resolve local file paths using `path.resolve(process.cwd(), base64Data)`. A malicious admin could configure this to `../../../../etc/passwd` to read arbitrary system files.
**Learning:** Never inherently trust settings derived from the database (even if modified by "admins") when resolving system paths, especially if the app architecture allows administrators to manipulate setting variables freely.
**Prevention:** Always validate that resolved file paths map strictly within an expected base directory (e.g. `filePath.startsWith(path.resolve(UPLOADS_DIR))`) before exposing them to the filesystem or network responses.
