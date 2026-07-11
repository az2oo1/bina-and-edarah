## 2025-03-05 - Critical Authentication Bypass and Secret Exposure
**Vulnerability:** A hardcoded \`JWT_SECRET\` was present in \`server.ts\` making all JWTs forgeable if \`process.env.JWT_SECRET\` wasn't set. Additionally, there was an unconditional hardcoded backdoor for user \`admin:admin\` that granted full administrator access regardless of the database state.
**Learning:** Hardcoded credentials and secrets as fallbacks in production-ready files pose an immense risk. The \`admin:admin\` fallback overrode normal database lookups, providing a permanent backdoor to anyone who checked the source code or guessed default credentials. Using a hardcoded JWT secret is equally dangerous since an attacker could forge tokens with any permission level.
**Prevention:** Never use predictable or hardcoded secrets as fallbacks in code. Always generate secure random fallbacks (e.g. \`crypto.randomBytes()\`) for required cryptography keys, and never implement credentials logic that unconditionally bypasses database lookup.
## 2024-05-18 - SQL Injection via Unsafe Prisma Raw Query
**Vulnerability:** SQL Injection in Admin Update via raw SQL fallback using \`prisma.$executeRawUnsafe\`.
**Learning:** String concatenation inside \`prisma.$executeRawUnsafe\` permits attackers to execute arbitrary SQL commands if the parameters aren't strictly sanitized.
**Prevention:** Always use \`prisma.$executeRaw\` alongside tagged template literals (e.g. \`\`prisma.$executeRaw\`UPDATE Table SET col = \${val}\` \`\`) for dynamic SQL queries to benefit from Prisma's automatic parameterization, or use Prisma Client operations wherever possible.
## 2025-03-05 - SQL Injection in Settings Update via raw SQL fallback
**Vulnerability:** SQL Injection in Settings Update via raw SQL fallback.
**Learning:** \`prisma.$executeRawUnsafe\` interpolates raw strings directly into the query execution, leaving it vulnerable to injection if the strings include unescaped malicious payloads. Even basic replacement \`val.replace(/'/g, "''")\` is brittle.
**Prevention:** Use \`prisma.$executeRaw\` alongside \`Prisma.sql\` to leverage native database parameterized queries. For column names which cannot be parameterized, strictly validate the name against an alphanumeric whitelist before injection using \`Prisma.raw(field)\`.
