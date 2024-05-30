#!/bin/bash

# Replace "artifact.zip" with the actual name of your artifact zip file
ARTIFACT="s3://my-nest-project-44444/buildArtifact/dist"
APP_DIR="/home/ubuntu/nestsj-api"

# Transfer the artifact zip file to the EC2 instance

aws s3 cp $ARTIFACT /tmp --recursive

ssh -i ./nestjs-key.pem ubuntu@your-ec2-instance-ip << EOF
  # Navigate to the application directory
  cd $APP_DIR

  # Move the artifact folder from /tmp to the application directory
  mv /tmp/dist/* .

  # Install dependencies
  npm install

  # Start the Node.js application
  node main.js
EOF