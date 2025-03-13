module.exports = {
    name: "Package Manager Queue [Dependency]",

    description: "Starts the Package Manager Queue dependency required for other blocks to work.",

    category: "Dependencies",

    inputs: [],

    options: [
        {
            id: "devmode",
            name: "Developer Mode",
            description: "Description: If you are a developer and want to see more information in the console.",
            type: "CHECKBOX",
        },
    ],

    outputs: [],

    async init(DBB, blockName) {
        try {
            const fs = require("fs");
            if (DBB.Blocks.cache.has("package_manager")) fs.rmSync("./blocks/package_manager.js");
            if (DBB.Blocks.cache.has("auto_package_manager")) fs.rmSync("./blocks/auto_package_manager.js");
            if (!DBB.Dependencies) DBB.Dependencies = {};
            if (!DBB.Dependencies.PackageManager) {
                const { exec } = require("child_process");
                const values = JSON.parse(fs.readFileSync(DBB.File.paths.workspaces))
                    .map((workspace) => {
                        if (workspace.workspaces) {
                            return workspace.workspaces.map((wpc) => wpc.blocks.filter((x) => x.name == blockName)).flat();
                        } else {
                            return workspace.blocks.filter((x) => x.name == blockName);
                        }
                    })
                    .filter((x) => x[0])
                    .map((x) => x.map((x) => x.options).flat())
                    .flat()[0];
                let devmode = values ? values.devmode : false;

                DBB.Dependencies.PackageManager = new (class PackageManager {
                    constructor() {
                        this.requireRestart = false;
                    }

                    async log(message, type = "INFO", force = false) {
                        if (devmode || force) {
                            DBB.Core.console(type, message);
                        }
                    }

                    async installAxiosIfMissing() {
                        try {
                            const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
                            if (!packageJson.dependencies?.axios && !packageJson.devDependencies?.axios) {
                                this.log("Axios is not installed. Installing axios...");
                                await this.installLatestVersion("axios");
                                this.log("Axios installed successfully.", "SUCCESS");
                                this.log("Triggering application restart after axios installation...", "INFO");
                                DBB.Core.restart();
                            }
                        } catch (error) {
                            throw new Error(`Error ensuring axios is installed: ${error.message}`);
                        }
                    }

                    async installLatestVersion(packageNameWithTag, force = false) {
                        return new Promise((resolve, reject) => {
                            exec(`npm install ${packageNameWithTag}` + (force ? " --force" : ""), (error, stdout, stderr) => {
                                if (error) {
                                    reject(`Error installing ${packageNameWithTag}: ${stderr}`);
                                } else {
                                    resolve(stdout);
                                }
                            });
                        });
                    }

                    async getInstalledVersion(packageName) {
                        try {
                            const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
                            return packageJson.dependencies?.[packageName] || packageJson.devDependencies?.[packageName] || null;
                        } catch (error) {
                            throw new Error(`Could not read package.json: ${error.message}`);
                        }
                    }

                    async getBranchVersion(packageName, branch) {
                        const axios = require("axios");
                        try {
                            const { data } = await axios.get(`https://registry.npmjs.org/${packageName}`);
                            return data["dist-tags"]?.[branch] || null;
                        } catch (error) {
                            this.log(`Could not fetch ${branch} version for ${packageName}: ${error.message}`, "ERROR", true);
                        }
                    }

                    async requires(...packages) {
                        await this.installAxiosIfMissing();
                        let available = true;
                        if (packages) {
                            for (const p of packages) {
                                available = await this.processPackage(p.name, p.version, false, p.dnr);
                            }
                        }
                        if (this.requireRestart) DBB.Core.restart();
                        return available;
                    }

                    async processPackage(packageName, versionTag = "latest", force = false, dnr = false) {
                        try {
                            const installedVersion = await this.getInstalledVersion(packageName);
                            const branchVersion = await this.getBranchVersion(packageName, versionTag);

                            if (!installedVersion) {
                                await this.log(`${packageName} is not installed. Installing ${packageName}@${versionTag}...`, "INFO", true);
                                await this.installLatestVersion(`${packageName}@${versionTag}`);
                                await this.log(`${packageName}@${versionTag} installed successfully.`, "SUCCESS", true);
                                this.requireRestart = true;
                                return true;
                            } else if (force || installedVersion.replace(/\^/g, "") !== branchVersion) {
                                if (force) {
                                    await this.log(`${packageName} is being FORCE Updated, as it might've been corrupted.`, "INFO", true);
                                } else {
                                    await this.log(`${packageName} is outdated (${installedVersion} -> ${branchVersion}). Updating...`, "INFO", true);
                                }
                                await this.installLatestVersion(`${packageName}@${versionTag}`, true);
                                await this.log(`${packageName}@${versionTag} updated successfully.`, "SUCCESS", true);
                                this.requireRestart = true;
                                return true;
                            } else {
                                if (!dnr) {
                                    try {
                                        require(packageName);
                                    } catch (e) {
                                        await this.log(`Error requiring ${packageName}: ${e.message}. Attempting fix...`, "WARN");
                                        await this.installLatestVersion(`${packageName}@${versionTag}`, true);
                                        this.requireRestart = true;
                                        return false;
                                    }
                                }
                                await this.log(`${packageName} is already up-to-date (${installedVersion}).`, "INFO");
                                return true;
                            }
                        } catch (error) {
                            await this.log(`Failed to process ${packageName}: ${error.message}`, "ERROR");
                            await this.log(`Attempting to fix ${packageName}...`, "WARN");
                            try {
                                await this.installLatestVersion(`${packageName}@${versionTag}`, true);
                                this.requireRestart = true;
                                return false;
                            } catch (fixError) {
                                await this.log(`Critical failure: Unable to fix ${packageName}. Error: ${fixError.message}`, "ERROR");
                                throw fixError;
                            }
                        }
                    }
                })();
            }
        } catch (error) {
            console.log(error);
        }
    },
};
