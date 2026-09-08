#!/bin/bash

# save stdout and stderr to files
vercel deploy --prod >deployment-url.txt 2>error.txt

# check the exit code
code=$?
if [ $code -eq 0 ]; then
    deploymentUrl=$(cat deployment-url.txt)
    echo "Deployment successful: $deploymentUrl"
else
    errorMessage=$(cat error.txt)
    echo "There was an error: $errorMessage"
fi
