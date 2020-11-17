const fs = require('fs');
const path = require('path');
const electron_notarize = require('electron-notarize');
const args = process.argv;
const appleApiKey = args[2];
const appleApiIssuer = args[3];

console.log('got args', appleApiKey, appleApiIssuer);

async function notarize(params) {

    // Only notarize the app on Mac OS only.
    if (process.platform !== 'darwin') {
        return;
    }

    // Same appId in electron-builder.
    let appId = 'com.vitsaus.minidevtools';

    let appPath = path.join(__dirname, 'release-builds', 'minitools-darwin-x64', `minitools.app`);
    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    const config = {
        appBundleId: appId,
        appPath: appPath,
        appleApiKey,
        appleApiIssuer,
    }

    console.log(`Notarizing with config`, config);

    try {
        await electron_notarize.notarize(config);
    } catch (error) {
        console.error(error);
    }

    console.log(`Done notarizing ${appId}`);
};

notarize();