#!/bin/bash

# Change to root of project.
# See: http://stackoverflow.com/a/16349776/741892
cd "${0%/*}/.."

# Colors
# See: http://stackoverflow.com/a/5412776
BLUE=$(tput setaf 4)
CYAN=$(tput setaf 6)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
BOLD=$(tput bold)
NORMAL=$(tput sgr0)

printf "${CYAN}## Testing webpack build${NORMAL}\n"
npm run build-demo-wp || exit $?

EXPECTED="demo/build/main.js"
ACTUAL=$(find demo/build -type f | sort)

if [ "$EXPECTED" != "$ACTUAL" ]; then
  printf "${BOLD}${RED}Test failed${NORMAL}\n\n"
  printf "* Expected: \n${GREEN}${EXPECTED}${NORMAL}\n"
  printf "* Actual: \n${RED}${ACTUAL}${NORMAL}\n"
  exit 1
fi

printf "\n${GREEN}${BOLD}All tests passed${NORMAL}\n"
