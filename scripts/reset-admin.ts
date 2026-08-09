import "dotenv/config";
import { prisma } from "../src/lib/db.js";
import crypto from "crypto";

function generateRandomPassword(length = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  let pass = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

async function main() {
  const username = process.argv[2] || "admin";
  const newPassword = generateRandomPassword(12);

  const existing = await prisma.admin.findUnique({
    where: { username }
  });

  if (existing) {
    await prisma.admin.update({
      where: { id: existing.id },
      data: { password: newPassword }
    });
  } else {
    await prisma.admin.create({
      data: {
        username,
        password: newPassword,
        name: "Administrator",
        role: "ADMIN"
      }
    });
  }

  console.log("\n==================================================");
  console.log("🔐 [ADMIN PASSWORD RESET SUCCESSFUL]");
  console.log(`👤 Username     : ${username}`);
  console.log(`🔑 New Password : ${newPassword}`);
  console.log("==================================================\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed to reset admin password:", err);
  process.exit(1);
});
