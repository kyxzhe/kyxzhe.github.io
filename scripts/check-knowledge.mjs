import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const directory = new URL("../knowledge/public/", import.meta.url);
const files = readdirSync(directory).filter((file) => file.endsWith(".md"));
const knowledge = files.map((file) => readFileSync(new URL(file, directory), "utf8")).join("\n");

assert.equal(files.length, 12);
assert.match(knowledge, /Yuxiang \(Kevin\) Zheng/);
assert.match(knowledge, /EchoAlign/);
assert.match(knowledge, /Marian-Andrei Rizoiu/);
assert.match(knowledge, /Lin Tian/);
assert.doesNotMatch(knowledge, /kyx\.zhe@gmail\.com/i);
assert.doesNotMatch(knowledge, /0416\s*276\s*898|\+61\s*416\s*276\s*898/i);

console.log(`knowledge checks passed (${files.length} files)`);
