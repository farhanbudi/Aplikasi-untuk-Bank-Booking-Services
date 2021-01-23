#!/bin/bash#Get servers list
set -f
echo "Deploy project on server $DEPLOY_SERVER"    
ssh ubuntu@$DEPLOY_SERVER "cd /home/ubuntu/mvp/ && git stash && git pull origin master"
