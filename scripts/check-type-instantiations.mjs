import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// Baseline: 108,997. The small margin avoids hiding meaningful inference regressions.
const MAX_INSTANTIATIONS = 105_000;
const tscPath = fileURLToPath(new URL("../node_modules/typescript/bin/tsc", import.meta.url));
const result = spawnSync(
  process.execPath,
  [tscPath, "--noEmit", "--extendedDiagnostics", "--pretty", "false"],
  { encoding: "utf8" },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

const output = result.stdout + result.stderr;
const label = "Instantiations:";
const line = output.split("\n").find((outputLine) => outputLine.startsWith(label));
const instantiations = Number(line?.slice(label.length).trim());

if (!Number.isFinite(instantiations)) {
  throw new Error(`Could not read type instantiations from tsc output:\n${output}`);
}

if (instantiations > MAX_INSTANTIATIONS) {
  throw new Error(
    `Type instantiations increased to ${instantiations.toLocaleString()} (maximum: ${MAX_INSTANTIATIONS.toLocaleString()}).`,
  );
}

console.log(
  `Type instantiations: ${instantiations.toLocaleString()} / ${MAX_INSTANTIATIONS.toLocaleString()}`,
);
