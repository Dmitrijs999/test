# !/bin/bash

set -e

EXISTING_DEPLOYMENT_IDS=$(curl -s \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: token $GITHUB_DEPLOYMENT_TOKEN" \
    https://api.github.com/repos/minterest-finance/$CIRCLE_PROJECT_REPONAME/deployments?ref=$CIRCLE_BRANCH \
  | jq .[].id)

for ID in $EXISTING_DEPLOYMENT_IDS
do
  echo "Deleting existing Github deployment $ID"

  curl -s -X POST \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: token $GITHUB_DEPLOYMENT_TOKEN" \
    https://api.github.com/repos/minterest-finance/$CIRCLE_PROJECT_REPONAME/deployments/$ID/statuses \
    -d '{"state":"inactive"}' > /dev/null

  curl -s -X DELETE \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: token $GITHUB_DEPLOYMENT_TOKEN" \
    https://api.github.com/repos/minterest-finance/$CIRCLE_PROJECT_REPONAME/deployments/$ID > /dev/null
done

DEPLOYMENT=$(curl -s -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_DEPLOYMENT_TOKEN" \
  https://api.github.com/repos/minterest-finance/$CIRCLE_PROJECT_REPONAME/deployments \
  -d '{"ref":"'"$CIRCLE_BRANCH"'","environment":"temp", "auto_merge":false, "transient_environment":true,"required_contexts":[]}')

DEPLOYMENT_ID=$(echo ${DEPLOYMENT} | jq .id)

echo "Publishing a new Github deployment $DEPLOYMENT_ID"

curl -s -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_DEPLOYMENT_TOKEN" \
  https://api.github.com/repos/minterest-finance/$CIRCLE_PROJECT_REPONAME/deployments/$DEPLOYMENT_ID/statuses \
  -d '{"state":"success","environment_url":"'"$WEBSITE_URL"'","auto_inactive":true}' > /dev/null

echo "Successfully deployed to $WEBSITE_URL"
