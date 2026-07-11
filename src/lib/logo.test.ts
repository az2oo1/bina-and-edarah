import { test } from "node:test";
import * as assert from "node:assert";
import { emailLogoSvg, faviconDataUri } from "./logo.ts";

test("emailLogoSvg injects default width", () => {
    const img = emailLogoSvg();
    assert.ok(img.includes('width="66"'));
    assert.ok(img.startsWith('<img '));
});

test("emailLogoSvg injects custom width", () => {
    const img = emailLogoSvg(120);
    assert.ok(img.includes('width="120"'));
    assert.ok(img.startsWith('<img '));
});

test("faviconDataUri uses default color", () => {
    const uri = faviconDataUri();
    const base64Str = Buffer.from("#ffffff").toString("base64");
    // #ffffff base64 encodes to I2ZmZmZmZg== but since it's in the middle of a string,
    // we can decode and test for the color.
    const decoded = Buffer.from(uri.split("base64,")[1], "base64").toString("utf-8");
    assert.ok(decoded.includes("#ffffff"));
});

test("faviconDataUri uses custom color", () => {
    const uri = faviconDataUri("#000000");
    const decoded = Buffer.from(uri.split("base64,")[1], "base64").toString("utf-8");
    assert.ok(decoded.includes("#000000"));
});

test("faviconDataUri returns valid data URI format", () => {
    const uri = faviconDataUri();
    assert.ok(uri.startsWith("data:image/svg+xml;base64,"));
});
