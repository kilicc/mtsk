#!/bin/bash

# MTSK Development Script
# Starts API, UI, and Electron in development mode

# Get script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

echo "🚀 Starting MTSK Development Environment..."
echo "📁 Project root: $PROJECT_ROOT"

# Kill any existing processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start API server in background
echo "📡 Starting API server..."
cd "$PROJECT_ROOT/packages/api"
pnpm dev > /tmp/mtsk-api.log 2>&1 &
API_PID=$!
echo "API PID: $API_PID"

# Wait for API to be ready
sleep 3

# Start UI dev server in background
echo "🎨 Starting UI dev server..."
cd "$PROJECT_ROOT/packages/ui"
pnpm dev > /tmp/mtsk-ui.log 2>&1 &
UI_PID=$!
echo "UI PID: $UI_PID"

# Wait for UI to be ready
sleep 5

# Start Electron
echo "🖥️  Starting Electron..."
cd "$PROJECT_ROOT/packages/app"
NODE_ENV=development pnpm start:dev

# Cleanup on exit
trap "kill $API_PID $UI_PID 2>/dev/null; exit" INT TERM
