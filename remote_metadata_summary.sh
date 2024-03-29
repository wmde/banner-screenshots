#!/bin/bash
# This file should go away when we have installed the screenshot tool on the server

if [ -z "$1" ]; then
  echo "You must provide the remote server name!"
  exit
fi

if [ -z "$2" ]; then
  echo "You must provide the remote directory!"
  exit
fi

local_metadata_dir=$(mktemp -d -t bannerdata-XXXXXXXXXX)
remote_screenshot_dir="${2/%\//}"

# If copying all the data takes too long at some point,
# consider a non-temporary directory
rsync --recursive "$1:$remote_screenshot_dir/" $local_metadata_dir
read -p "Copy the metadata files from $local_metadata_dir to subdirectories banner-shots, press Enter when ready ..."
npx ts-node metadata_summary.js
read -p "Copy then metadata summary to $local_metadata_dir and press Enter ..."
scp -Cq "$local_metadata_dir/metadata_summary.json" "$1:$2"
metadata_file_count=$(find $local_metadata_dir -name metadata.json | wc -l)
echo "Generated summary for $metadata_file_count files"
rm -rf $local_metadata_dir
