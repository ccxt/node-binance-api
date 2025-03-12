
#!/bin/bash
set -e

# release defaults to patch (last number in semver)
RELEASE="patch" && [ -n "$1" ] && RELEASE=$1

# cut the release
VERSION=$(npm --no-git-tag-version version $RELEASE | sed 's/v//')

git add package.json
git commit -m "release: cut the $VERSION release"

# tag the release
git tag $VERSION
git tag -l

echo -e "\033[1;92m You are ready to publish!"
echo -e "\033[1;95m git push"
echo -e "\033[1;95m git push --tags"
echo -e "\033[1;95m npm publish"
