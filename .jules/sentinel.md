## Date: $(date +"%Y-%m-%d")
**Vulnerability:** SQL Injection in Settings Update via raw SQL fallback.
**Learning:** `prisma.$executeRawUnsafe` interpolates raw strings directly into the query execution, leaving it vulnerable to injection if the strings include unescaped malicious payloads. Even basic replacement `val.replace(/'/g, "''")` is brittle.
**Prevention:** Use `prisma.$executeRaw` alongside `Prisma.sql` to leverage native database parameterized queries. For column names which cannot be parameterized, strictly validate the name against an alphanumeric whitelist before injection using `Prisma.raw(field)`.
