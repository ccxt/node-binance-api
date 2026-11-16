#!/bin/bash
# Type-checks the packed package from CommonJS and ESM consumers under
# `--module nodenext`, to make sure every `exports` entry ships declarations.
set -u

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TSC="$ROOT_DIR/node_modules/.bin/tsc"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

cd "$ROOT_DIR"
TARBALL="$(npm pack . --silent --pack-destination "$WORK_DIR" | tail -n 1)"
cp ./tests/package-types-test/*.cts ./tests/package-types-test/*.mts ./tests/package-types-test/tsconfig.json "$WORK_DIR"/

cd "$WORK_DIR"
echo '{ "name": "package-types-test", "private": true }' > package.json
npm install --silent --no-audit --no-fund "./$TARBALL" > /dev/null

"$TSC" -p tsconfig.json
return_code=$?

if [ $return_code -eq 0 ]; then
  echo "Package types test successful"
else
  echo "Package types test failed"
fi
exit $return_code
