#!/bin/bash
# Type-checks the packed package from CommonJS and ESM consumers, to make sure
# every `exports` entry ships declarations that resolve and type-check
# (skipLibCheck is off) under each Node-style module mode.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TSC="$ROOT_DIR/node_modules/.bin/tsc"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

cd "$ROOT_DIR"
TARBALL="$(npm pack . --silent --pack-destination "$WORK_DIR" | tail -n 1)"
cp ./tests/package-types-test/*.cts ./tests/package-types-test/*.mts ./tests/package-types-test/*.json "$WORK_DIR"/

cd "$WORK_DIR"
echo '{ "name": "package-types-test", "private": true }' > package.json
npm install --no-audit --no-fund --loglevel=error "./$TARBALL"

status=0
for mode in node16 nodenext; do
  echo "tsc --module $mode"
  "$TSC" -p tsconfig.json --module "$mode" --moduleResolution "$mode" || status=1
  echo "tsc --module $mode --esModuleInterop false"
  "$TSC" -p tsconfig.no-interop.json --module "$mode" --moduleResolution "$mode" || status=1
done

if [ $status -eq 0 ]; then
  echo "Package types test successful"
else
  echo "Package types test failed"
fi
exit $status
