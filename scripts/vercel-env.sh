#!/usr/bin/env bash
#
# Pushes .env.local into Vercel for all three environments.
#
#   npx vercel login     # once, opens a browser
#   npx vercel link      # once, pick the "socialnerd" project
#   bash scripts/vercel-env.sh
#
# NEXT_PUBLIC_SITE_URL is overridden: the local value points at localhost, and
# shipping that to production puts localhost links in every unsubscribe email.
#
# GEMINI_API_KEY is skipped — nothing in the codebase reads it.
#
# Re-running is safe: each key is removed before being added, so values are
# replaced rather than duplicated.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1

ENV_FILE=".env.local"
PROD_URL="${PROD_URL:-https://socialnerd.vercel.app}"

[ -f "$ENV_FILE" ] || { echo "No $ENV_FILE here."; exit 1; }

if ! npx --no-install vercel whoami >/dev/null 2>&1; then
  echo "Not logged in. Run: npx vercel login"
  exit 1
fi

if [ ! -f .vercel/project.json ]; then
  echo "This directory isn't linked to a project. Run: npx vercel link"
  exit 1
fi

# Read at runtime; nothing is written to disk or echoed.
KEYS=$(grep -oE '^[A-Z_]+=' "$ENV_FILE" | tr -d '=')

for KEY in $KEYS; do
  case "$KEY" in
    GEMINI_API_KEY)
      echo "skip  $KEY (unused by this codebase)"
      continue
      ;;
    NEXT_PUBLIC_SITE_URL)
      VALUE="$PROD_URL"
      ;;
    *)
      VALUE=$(grep -m1 "^$KEY=" "$ENV_FILE" | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
      ;;
  esac

  [ -n "$VALUE" ] || { echo "skip  $KEY (empty)"; continue; }

  for TARGET in production preview development; do
    npx --no-install vercel env rm "$KEY" "$TARGET" --yes >/dev/null 2>&1
    if printf '%s' "$VALUE" | npx --no-install vercel env add "$KEY" "$TARGET" >/dev/null 2>&1; then
      printf '  ok    %-24s %s\n' "$KEY" "$TARGET"
    else
      printf '  FAIL  %-24s %s\n' "$KEY" "$TARGET"
    fi
  done
done

echo
echo "Done. Env changes only apply to NEW builds — redeploy:"
echo "  npx vercel --prod"
