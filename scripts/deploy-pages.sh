#!/usr/bin/env bash
# Deploy STOCKED to GitHub Pages as a single joelle-y10-only commit.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export GIT_AUTHOR_NAME='joelle-y10'
export GIT_AUTHOR_EMAIL='232954571+joelle-y10@users.noreply.github.com'
export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"

npm run build

WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT
git init "$WORKDIR"
cd "$WORKDIR"
git checkout -b gh-pages
cp -R "$ROOT/dist/." .
touch .nojekyll
git add -A
git -c user.name="$GIT_AUTHOR_NAME" -c user.email="$GIT_AUTHOR_EMAIL" \
  -c trailer.ifexists=doNothing \
  commit --no-verify -m "Deploy STOCKED GitHub Pages."
git remote add origin https://github.com/joelle-y10/stockedjoelle.git
git push --force origin gh-pages
echo "Deployed gh-pages as joelle-y10 only."
