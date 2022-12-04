import * as core from '@actions/core';
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as os from 'os';
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

async function getLatestTag() {
    const url = 'https://api.github.com/repos/emacs-eask/cli/tags'
    return new Promise((resolve) => {
        let data = ''
        https.get(url, (res: any) => {
            res.on('data', (chunk: any) => { data += chunk })
            res.on('end', () => {
                let json = JSON.parse(data);
                resolve(json[0].name);
            });
        });
    });
}

async function run(): Promise<void> {
    try {
        const PATH = process.env.PATH;

        const home = os.homedir();
        const tmp = os.tmpdir();

        const latestVersion = await getLatestTag();  // from emacs-eask/cli
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
