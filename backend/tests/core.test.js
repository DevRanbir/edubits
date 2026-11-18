const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

const { computeScore } = require("../algorithms/scoring");
const { isTopicUnlocked, topologicalSort } = require("../algorithms/graph");
const { fisherYatesShuffle, pickRandom } = require("../algorithms/shuffle");

process.env.JWT_SECRET = "test-secret-that-is-long-enough-for-local-tests";
const rateLimitKey = require("../middleware/rateLimitKey");

test("quiz scoring keeps results within one attempt", () => {
  const result = computeScore([
    { questionId: "q1", isCorrect: true },
    { questionId: "q2", isCorrect: false },
    { questionId: "q3", timedOut: true },
  ]);

  assert.equal(result.totalScore, 4);
  assert.equal(result.maxPossibleScore, 12);
  assert.equal(result.percentage, 33);
  assert.equal(result.correctCount, 1);
  assert.equal(result.wrongCount, 1);
  assert.equal(result.timeoutCount, 1);
});

test("topic prerequisites unlock only after every prerequisite is complete", () => {
  assert.equal(isTopicUnlocked("advanced", [], {}), true);
  assert.equal(isTopicUnlocked("advanced", ["intro"], { intro: { completed: true } }), true);
  assert.equal(isTopicUnlocked("advanced", ["intro", "basics"], { intro: { completed: true } }), false);
});

test("topic sorting respects prerequisite order", () => {
  const topics = [
    { _id: "advanced", prerequisites: ["intro"] },
    { _id: "intro", prerequisites: [] },
  ];

  assert.deepEqual(topologicalSort(topics), ["intro", "advanced"]);
});

test("question shuffling and sampling preserve input and avoid duplicates", () => {
  const input = ["a", "b", "c", "d"];
  const shuffled = fisherYatesShuffle(input);
  const sample = pickRandom(input, 3);

  assert.deepEqual(input, ["a", "b", "c", "d"]);
  assert.deepEqual([...shuffled].sort(), [...input].sort());
  assert.equal(sample.length, 3);
  assert.equal(new Set(sample).size, 3);
});

test("rate limits authenticated requests by user rather than shared IP", () => {
  const token = jwt.sign({ id: "user-123" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const request = {
    headers: { cookie: `edubits_auth=${token}` },
    ip: "203.0.113.20",
  };

  assert.equal(rateLimitKey(request), "user:user-123");
});

test("rate limits anonymous and invalid-session requests by IP", () => {
  assert.equal(rateLimitKey({ headers: {}, ip: "203.0.113.20" }), "ip:203.0.113.20");
  assert.equal(
    rateLimitKey({ headers: { cookie: "edubits_auth=invalid" }, ip: "203.0.113.20" }),
    "ip:203.0.113.20"
  );
});
