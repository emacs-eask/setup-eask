import * as core from '@actions/core';
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import fs from 'fs';

async function run(): Promise<void> {
    try {
        const PATH = process.env.PATH;

        const version = core.getInput("version");

        let cmd = "npm install -g @emacs-eask/eask"

        core.startGroup("Installing Eask");

        if (version != "snapshot") {
            cmd += "@" + version;
        }

        await exec.exec(cmd);

        core.endGroup();

    } catch (error) {
        let errorMsg = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMsg = error.message;
        }
        core.setFailed(errorMsg);
    }
}

run();
