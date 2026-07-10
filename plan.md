1. **Fix Hardcoded Secret:** In `server.ts`, replace the hardcoded `JWT_SECRET` ("bina-edara-jwt-secret-key-1337") with a securely generated random string (`require('crypto').randomBytes(32).toString('hex')`) when `process.env.JWT_SECRET` is not provided.
2. **Remove Unconditional Backdoor:** In `server.ts`'s login route, remove the hardcoded fallback that grants full admin access for `admin:admin` unconditionally. This fallback overrides the database and acts as a permanent backdoor even if the real admin password is changed.
3. **Run Checks:** Execute `npm run lint` and `npm run build` to verify that the changes do not introduce any compilation or typing errors.
4. **Journal Entry:** Add an entry to `.jules/sentinel.md` documenting this CRITICAL security finding regarding the hardcoded JWT secret and the unconditional admin backdoor.
5. **Pre Commit Steps:** Complete pre commit steps to make sure proper testing, verifications, reviews and reflections are done.
6. **Submit PR:** Submit the security fix via a Pull Request with appropriate Sentinel-specific messaging.
