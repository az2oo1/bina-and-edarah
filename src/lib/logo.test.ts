import { test } from "node:test";
import * as assert from "node:assert";
import { emailLogoSvg, faviconDataUri } from "./logo.ts";

test("emailLogoSvg injects default width", () => {
    const svg = emailLogoSvg();
    assert.ok(svg.includes('width="66"'));
});

test("emailLogoSvg injects custom width", () => {
    const svg = emailLogoSvg(120);
    assert.ok(svg.includes('width="120"'));
});

test("faviconDataUri uses default color", () => {
    const uri = faviconDataUri();
    assert.ok(uri.includes("%23ffffff") || uri.includes(encodeURIComponent("#ffffff")));
});

test("faviconDataUri uses custom color", () => {
    const uri = faviconDataUri("#000000");
    assert.ok(uri.includes("%23000000") || uri.includes(encodeURIComponent("#000000")));
});

test("faviconDataUri returns valid data URI format", () => {
    const uri = faviconDataUri();
    assert.ok(uri.startsWith("data:image/svg+xml,"));
});
