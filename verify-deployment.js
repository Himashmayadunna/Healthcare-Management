#!/usr/bin/env node

/**
 * Vercel Deployment Helper
 * Run this script to verify your project is ready for Vercel deployment
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Healthcare Dashboard - Vercel Deployment Check\n");

// Check 1: vercel.json exists
console.log("✓ Checking vercel.json...");
if (fs.existsSync("vercel.json")) {
  console.log("  ✅ vercel.json found\n");
} else {
  console.log("  ❌ vercel.json missing - create it from root directory\n");
}

// Check 2: .env.local exists
console.log("✓ Checking environment setup...");
if (fs.existsSync(".env.local")) {
  console.log("  ✅ .env.local found\n");
} else {
  console.log("  ⚠️  .env.local missing - configure in Vercel dashboard instead\n");
}

// Check 3: Backend files
console.log("✓ Checking backend structure...");
const backendFiles = ["backend/server.js", "backend/package.json", "backend/db/db.js"];
const backendOK = backendFiles.every((file) => fs.existsSync(file));
if (backendOK) {
  console.log("  ✅ Backend structure OK\n");
} else {
  console.log("  ❌ Backend files missing\n");
}

// Check 4: Frontend build
console.log("✓ Checking frontend setup...");
const frontendFiles = ["next.config.ts", "package.json", "tsconfig.json"];
const frontendOK = frontendFiles.every((file) => fs.existsSync(file));
if (frontendOK) {
  console.log("  ✅ Frontend structure OK\n");
} else {
  console.log("  ❌ Frontend files missing\n");
}

// Check 5: Dependencies
console.log("✓ Checking dependencies...");
const pkgPath = path.join(__dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const hasNext = "next" in pkg.dependencies;
const hasReact = "react" in pkg.dependencies;
if (hasNext && hasReact) {
  console.log("  ✅ Dependencies OK\n");
} else {
  console.log("  ⚠️  Run npm install to ensure all dependencies\n");
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("\n📋 Deployment Checklist:\n");
console.log("  [ ] Push code to GitHub");
console.log("  [ ] Create Vercel account");
console.log("  [ ] Connect GitHub to Vercel");
console.log("  [ ] Add environment variables in Vercel:");
console.log("      - NEXT_PUBLIC_API_BASE_URL");
console.log("      - DB_USER");
console.log("      - DB_PASSWORD");
console.log("      - DB_CONNECT");
console.log("  [ ] Trigger deployment");
console.log("  [ ] Monitor logs in Vercel Dashboard");
console.log("\n📖 Read VERCEL_DEPLOYMENT.md for full instructions\n");
