#!/bin/bash
# =============================================================================
# _TEMPLATE - K8S Compatible Dev Watch
# =============================================================================
# Runs all custom library watchers with polling mode for k8s volumes
# =============================================================================

set -e

cd "$(dirname "$0")"

echo "🔧 Starting _TEMPLATE dev watchers (k8s compatible)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TSC_WATCHFILE=DynamicPriorityPolling \
TSC_WATCHDIRECTORY=DynamicPriorityPolling \
CHOKIDAR_USEPOLLING=true \
CHOKIDAR_INTERVAL=1000 \
pnpm dev

