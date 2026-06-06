#!/bin/bash
# ChatInc Marketing Pipeline installer — Mac/Linux
# Double-click this file. No technical knowledge needed.

set -e
cd "$(dirname "$0")"

# This script + the chatinc-plugins folder are in the same directory.
# Marketplace folder is one level up from this install/ folder.
MARKETPLACE_DIR="$(cd .. && pwd)"

cat << 'BANNER'

  ============================================================
    ChatInc Marketing Pipeline — Installer
  ============================================================

  This installs the Marketing Command Center on your computer.
  Takes about 20 seconds. No typing required.

BANNER

# Check Claude Code is installed
if ! command -v claude >/dev/null 2>&1; then
  echo "  [X] Claude Code is not installed."
  echo ""
  echo "      Install Claude Code first:"
  echo "      https://docs.claude.com/en/docs/claude-code/quickstart"
  echo ""
  read -p "  Press Enter to close..." dummy
  exit 1
fi
echo "  [OK] Claude Code detected"
echo ""

# Add the LOCAL marketplace folder (no git, no GitHub)
echo "  > Adding marketing-pipeline marketplace from $MARKETPLACE_DIR..."
claude plugin marketplace add "$MARKETPLACE_DIR" 2>&1 | tail -3
echo "  [OK] Marketplace added"
echo ""

# Install the plugin
echo "  > Installing marketing-pipeline plugin..."
claude plugin install marketing-pipeline@chatinc-plugins 2>&1 | tail -3
echo "  [OK] Plugin installed"
echo ""

# Create the marketing folder
MARKETING_DIR="$HOME/Documents/ChatInc-Marketing"
mkdir -p "$MARKETING_DIR/_libraries"
echo "  [OK] Marketing folder created at $MARKETING_DIR"
echo ""

cat << 'DONE'

  ============================================================
    [OK] INSTALL COMPLETE
  ============================================================

  Next:
  1. Open Claude Code (Cmd+Space — search "Claude")
  2. Type: /install-marketing-command-center
  3. Then: /start-campaign
  4. (Optional) /open-command-center to see the dashboard

  Updates: when admin sends a new version, run this installer again.

DONE
read -p "  Press Enter to close..." dummy
