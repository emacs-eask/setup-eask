import * as core from '@actions/core';
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import fs from 'fs';
const https = require('https');

function getPlatform(): string {
    switch (process.platform) {
        case 'linux': return 'linux';
        case 'darwin': return 'macos';
        case 'win32': return 'win';
    }
    return 'linux';  /* Default: linux */
}

async function getLatestTag(): string {
    let body = "";
    let json;
    await https.get(
        'https://api.github.com/repos/emacs-eask/cli/tags',
        (res) => {
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    json = JSON.parse(body);
                } catch (error) {
                    console.error(error.message);
                };
            });
        });
    return json;
}

async function run(): Promise<void> {
    try {
        const PATH = process.env.PATH;

        const home = os.homedir();
        const tmp = os.tmpdir();

        const latestVersion = getLatestTag();  // from emacs-eask/cli
        const inputVersion = core.getInput("version");
        const version = (inputVersion == 'snapshot') ? latestVersion : inputVersion;
        const architecture = core.getInput("architecture");
        const platform = getPlatform();

        const archiveName = `eask_${version}_${platform}-${architecture}.zip`;

        core.startGroup("Fetch Eask");

        await exec.exec('curl', [
            '-L',
            `https://github.com/emacs-eask/cli/releases/download/${version}/${archiveName}`,
            '-o',
            `${tmp}/${archiveName}`
        ]);
        await exec.exec('unzip', [`${tmp}/${archiveName}`, '-d', `${tmp}`]);
        const options = { recursive: true, force: false };
        await io.mv(`${tmp}/eask-${version}`, `${home}/.eask`, options);
        core.addPath(`${home}/.eask/bin`);

        core.endGroup();

        // show Eask version
        await exec.exec('eask', ['--version']);
    } catch (error) {
        let errorMsg = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMsg = error.message;
        }
        core.setFailed(errorMsg);
    }
}

run();
