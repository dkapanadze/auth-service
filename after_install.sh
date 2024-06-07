#!/bin/bash

# Replace "artifact.zip" with the actual name of your artifact zip file
ARTIFACT="s3://my-nest-project-44444/test"
APP_DIR="/home/ubuntu/nestsj-api"

# Transfer the artifact zip file to the EC2 instance

aws s3 cp $ARTIFACT /tmp --recursive

ssh -i ./nestjs-key.pem ubuntu@your-ec2-instance-ip << EOF
  # Navigate to the application directory
  cd $APP_DIR

  # Unzip the artifact
  unzip /tmp/buildProject.zip -d $APP_DIR

  # Remove the zip file after extraction
  rm /tmp/buildProject.zip

  # Install dependencies
  npm install

  # Start the Node.js application
  node main.js
EOF