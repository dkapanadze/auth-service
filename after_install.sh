#!/bin/bash

# Replace "artifact.zip" with the actual name of your artifact zip file
ARTIFACT="buildArtifact.zip"
APP_DIR="/home/ubuntu/nestsj-api"

# Transfer the artifact zip file to the EC2 instance
scp -i ./nestjs-key.pem $ARTIFACT ubuntu@your-ec2-instance-ip:/tmp/

# Connect to the EC2 instance and perform deployment steps
ssh -i ./nestjs-key.pem ubuntu@your-ec2-instance-ip << EOF
  # Navigate to the application directory
  cd $APP_DIR

  # Unzip the artifact
  unzip /tmp/$ARTIFACT -d .

  # Navigate into the unzipped artifact directory
  cd $APP_DIR

  # Install dependencies
  npm install

  # Start the Node.js application
  node main.js
EOF