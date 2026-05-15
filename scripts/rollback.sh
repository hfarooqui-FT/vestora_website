#!/usr/bin/env bash
# Rollback / inspect Cloud Run revisions for vestora-website.
#
# Usage:
#   scripts/rollback.sh status            # show revision currently serving 100% traffic
#   scripts/rollback.sh list [N]          # list latest N revisions (default 10)
#   scripts/rollback.sh prev              # flip 100% traffic to the revision just before the current one
#   scripts/rollback.sh to <revision>     # flip 100% traffic to the named revision
#   scripts/rollback.sh pin               # pin 100% traffic to the current revision (disables auto-promote on new deploys)
#   scripts/rollback.sh unpin             # restore auto-promote (latest revision = 100% traffic)

set -euo pipefail

PROJECT="vestora-website"
REGION="europe-west3"
SERVICE="vestora-website"

cmd="${1:-status}"

require_gcloud() {
  command -v gcloud >/dev/null || { echo "gcloud not found in PATH" >&2; exit 1; }
}

current_revision() {
  gcloud run services describe "$SERVICE" \
    --region="$REGION" --project="$PROJECT" \
    --format='value(status.traffic[0].revisionName)'
}

list_revisions() {
  local limit="${1:-10}"
  gcloud run revisions list \
    --service="$SERVICE" --region="$REGION" --project="$PROJECT" \
    --format='table(metadata.name,status.conditions[0].lastTransitionTime,spec.containers[0].image.basename())' \
    --limit="$limit"
}

confirm() {
  local msg="$1"
  read -r -p "$msg [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
}

require_gcloud

case "$cmd" in
  status)
    cur=$(current_revision)
    echo "Service:   $SERVICE ($REGION, project=$PROJECT)"
    echo "Serving:   $cur (100%)"
    ;;

  list)
    list_revisions "${2:-10}"
    ;;

  prev)
    cur=$(current_revision)
    prev=$(gcloud run revisions list \
      --service="$SERVICE" --region="$REGION" --project="$PROJECT" \
      --format='value(metadata.name)' --limit=10 \
      | grep -v "^${cur}$" | head -n 1)
    if [[ -z "$prev" ]]; then
      echo "No previous revision found." >&2
      exit 1
    fi
    echo "Current:  $cur"
    echo "Rollback: $prev"
    confirm "Shift 100% traffic to $prev?"
    gcloud run services update-traffic "$SERVICE" \
      --region="$REGION" --project="$PROJECT" \
      --to-revisions="${prev}=100"
    ;;

  to)
    target="${2:-}"
    [[ -n "$target" ]] || { echo "Usage: $0 to <revision>" >&2; exit 1; }
    cur=$(current_revision)
    echo "Current:  $cur"
    echo "Target:   $target"
    confirm "Shift 100% traffic to $target?"
    gcloud run services update-traffic "$SERVICE" \
      --region="$REGION" --project="$PROJECT" \
      --to-revisions="${target}=100"
    ;;

  pin)
    cur=$(current_revision)
    echo "Pinning 100% traffic to $cur (disables auto-promote on future deploys)."
    confirm "Proceed?"
    gcloud run services update-traffic "$SERVICE" \
      --region="$REGION" --project="$PROJECT" \
      --to-revisions="${cur}=100"
    ;;

  unpin)
    echo "Restoring auto-promote: latest healthy revision will receive 100% traffic."
    confirm "Proceed?"
    gcloud run services update-traffic "$SERVICE" \
      --region="$REGION" --project="$PROJECT" \
      --to-latest
    ;;

  *)
    echo "Unknown command: $cmd" >&2
    echo "Run '$0' with no args for status, or see header of this file for usage." >&2
    exit 1
    ;;
esac
