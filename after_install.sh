#!/bin/bash

echo "Current working directory: $(pwd)"
# Print the directory name of the script
echo "Script directory: $(dirname "$0")"

# Set executable permission for the script itself
chmod +x "$0"

# Get the deployment directory from the environment variables
DEPLOYMENT_DIR="$DEPLOYMENT_GROUP_NAME/$DEPLOYMENT_ID/deployment-archive"

# Navigate to the deployment directory
cd "/opt/codedeploy-agent/deployment-root/$DEPLOYMENT_DIR"

# Set executable permission for the script
chmod +x after_install.sh

# Verify the permissions after setting them
ls -l after_install.sh
# Replace "artifact.zip" with the actual name of your artifact zip file
ARTIFACT="s3://my-nest-project-44444/test/buildProject.zip"
APP_DIR="/home/ubuntu/nestsj-api"

# Transfer the artifact zip file to the EC2 instance

aws s3 cp $ARTIFACT /tmp --recursive

aws s3 cp s3://my-nest-project-44444/nestjs-key.pem /tmp --recursive

chmod 400 /tmp/nestjs-key.pem

ssh -i  /tmp/nestjs-key.pem -t -t ubuntu@ec2-54-205-124-72.compute-1.amazonaws.com << EOF
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