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

async function getLatest(): string {
    let body = "";
    await https.get(
        'https://api.github.com/repos/emacs-eask/cli/tags',
        (res) => {
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    let json = JSON.parse(body);
                } catch (error) {
                    console.error(error.message);
                };
            });
        });
}

async function run(): Promise<void> {
    try {
        const PATH = process.env.PATH;

        const latestVersion = '0.7.2';
        const inputVersion = core.getInput("version");
        const version = inputVersion == 'snapshot' ? latestVersion : inputVersion;
        const architecture = core.getInput("architecture");
        const platform = getPlatform();

        const binUrl = `https://github.com/emacs-eask/cli/releases/download/${version}/eask_${version}_${platform}-${architecture}.zip`;

        core.startGroup("Installing Eask");



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
