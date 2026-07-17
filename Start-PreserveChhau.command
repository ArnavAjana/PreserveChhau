#!/bin/bash

set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1
then
  echo "Node.js is missing. Install Node.js 22 from https://nodejs.org, then open this file again."
  read -r -p "Press Return to close."
  exit 1
fi

if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 20 || (major === 20 && minor >= 19) ? 0 : 1)'
then
  current_node_version=$(node -p 'process.versions.node')
  echo "Node.js ${current_node_version} is too old. Install Node.js 22 from https://nodejs.org, then open this file again."
  read -r -p "Press Return to close."
  exit 1
fi

if [ ! -x "node_modules/.bin/vite" ] || [ ! -x "node_modules/.bin/next" ]
then
  echo "Installing the project packages. This runs once."
  npm ci
fi

echo "Starting PreserveChhau at http://localhost:3000"
npm run dev
