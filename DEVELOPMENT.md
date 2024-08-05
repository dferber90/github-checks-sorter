## To develop

1. Go to [chrome://extensions](chrome://extensions)
2. Select "Load unpacked extension"
3. Select the folder this repository lives in

Since there is no compile step you don't need to run anything on the command line. You only need to press the reload button in [chrome://extensions](chrome://extensions).

## To release a new version

1. Run `./build.sh`, which creats `extension.zip`
2. Go to the [Chrome Web Store](https://chrome.google.com/webstore/devconsole/5f045396-cf60-4a76-b638-b682e330a682/impfkakcdbkmdebcchmmgcficdajjjcd/edit/package)
3. Select "Upload package" and upload `extension.zip`
