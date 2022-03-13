import * as core from '@actions/core';
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import fs from 'fs'

async function run(): Promise<void> {
    try {
        const PATH = process.env.PATH;

        const version = core.getInput("version");

        core.startGroup("Installing Eask");

        if (version == "snapshot") {
            
        } else {
            
        }

        const extractPath = "c:\\emacs";
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath);
        }

        const emacsZip = await tc.downloadTool(zipPath);
        const emacsDir = await tc.extractZip(emacsZip, extractPath);

        let emacsRoot = emacsDir;
        let emacsBin = emacsRoot + "\\bin";
        if (!fs.existsSync(emacsBin)) {
            emacsRoot = emacsDir + "\\" + emacs_dot_var;
            emacsBin = emacsRoot + "\\bin";  // Refresh
        }

        core.exportVariable("PATH", `${PATH};${emacsRoot}`);
        core.exportVariable("PATH", `${PATH};${emacsBin}`);

        core.endGroup();

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
