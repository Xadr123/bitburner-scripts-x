/** @param {NS} ns */
export async function main(ns) {
    let servers = JSON.parse(ns.read("serverList.txt"));
    let scriptFiles = [
        "/bootstrap/newHack.js",
        "/bootstrap/newWeaken.js",
        "/bootstrap/newGrow.js",
    ];
    let growRam = ns.getScriptRam("/bootstrap/newGrow.js", "home");
    let weakenRam = ns.getScriptRam("/bootstrap/newWeaken.js", "home");
    let hackRam = ns.getScriptRam("/bootstrap/newHack.js", "home");

    while (
        true
        // servers.filter(
        //     (s) =>
        //         s.requiredHackingSkill <= ns.getHackingLevel() &&
        //         !s.hasAdminRights
        // ).length >= 1
    ) {
        let hackTarget = "iron-gym";
        for (let server of servers) {
            let serverPosition = servers.findIndex(
                (s) => s.hostname == server.hostname
            );
            ns.tprint("Target: ", server.hostname);
            await ns.sleep(20);
            if (server.numOpenPortsRequired > 0 && server.openPortCount == 0) {
                if (ns.fileExists("BruteSSH.exe") && !server.sshPortOpen) {
                    ns.tprint(
                        server.openPortCount,
                        " open ports, accessing new ports..."
                    );
                    // await ns.sleep(500);
                    ns.brutessh(server.hostname);
                    servers[serverPosition].sshPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.tprint("SSH port opened on ", server.hostname);
                    // await ns.sleep(500);
                }
                if (ns.fileExists("FTPCrack.exe") && !server.ftpPortOpen) {
                    ns.ftpcrack(server.hostname);
                    servers[serverPosition].ftpPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.tprint("FTP port opened on ", server.hostname);
                }
                if (ns.fileExists("relaySMTP.exe") && !server.smtpPortOpen) {
                    ns.relaysmtp(server.hostname);
                    servers[serverPosition].smtpPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.tprint("SMTP port opened on ", server.hostname);
                }
                if (ns.fileExists("HTTPWorm.exe") && !server.httpPortOpen) {
                    ns.httpworm(server.hostname);
                    servers[serverPosition].httpPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.tprint("HTTP port opened on ", server.hostname);
                }
                if (ns.fileExists("SQLInject.exe") && !server.sqlPortOpen) {
                    ns.sqlinject(server.hostname);
                    servers[serverPosition].sqlPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.tprint("SQL port opened on ", server.hostname);
                }
            }
            if (
                server.requiredHackingSkill <= ns.getHackingLevel() &&
                servers[serverPosition].openPortCount ==
                    server.numOpenPortsRequired
            ) {
                ns.nuke(server.hostname);
                servers[serverPosition].hasAdminRights = true;
                ns.tprint("Server accessed, injecting and executing scripts.");
                // await ns.sleep(500);
                ns.scp(scriptFiles, server.hostname, "home");
                let freeRam = server.maxRam - server.ramUsed;
                // ns.tprint(freeRam);
                // ns.tprint(weakenRam);
                // ns.tprint(freeRam / weakenRam);
                if (
                    ns.getServerMinSecurityLevel(hackTarget) + 4 <
                        ns.getServerSecurityLevel(hackTarget) &&
                    freeRam >= weakenRam
                ) {
                    let threadCount = Math.floor(server.maxRam / weakenRam);
                    ns.tprint("Executing weaken on ", server.hostname);
                    // await ns.sleep(500);
                    ns.exec(
                        "/bootstrap/newWeaken.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                    ns.tprint("Moving to next target...");
                    // await ns.sleep(500);
                } else if (
                    ns.getServerMoneyAvailable(hackTarget) <
                        ns.getServerMaxMoney(hackTarget) * 0.8 &&
                    freeRam >= growRam
                ) {
                    let threadCount = Math.floor(server.maxRam / growRam);
                    ns.tprint("Executing grow on ", server.hostname);
                    // await ns.sleep(500);
                    ns.exec(
                        "/bootstrap/newGrow.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                    ns.tprint("Moving to next target...");
                    // await ns.sleep(500);
                } else if (freeRam >= hackRam) {
                    let threadCount = Math.floor(server.maxRam / hackRam);
                    ns.tprint("Executing hack on ", server.hostname);
                    // await ns.sleep(500);
                    ns.exec(
                        "/bootstrap/newHack.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                    ns.tprint("Moving to next target...");
                    // await ns.sleep(500);
                }
            } else if (server.hasAdminRights) {
                ns.tprint(
                    server.hostname,
                    " has already been accessed, re-executing scripts."
                );
                // await ns.sleep(500);
                servers[serverPosition].hasAdminRights = true;
                ns.scp(scriptFiles, server.hostname, "home");
                let freeRam = server.maxRam - server.ramUsed;
                // ns.tprint(freeRam);
                // ns.tprint(weakenRam);
                // ns.tprint(freeRam / weakenRam);
                if (
                    ns.getServerMinSecurityLevel(hackTarget) + 4 <
                        ns.getServerSecurityLevel(hackTarget) &&
                    freeRam >= weakenRam
                ) {
                    let threadCount = Math.floor(server.maxRam / weakenRam);
                    ns.tprint("Executing weaken on ", server.hostname);
                    // await ns.sleep(500);
                    ns.exec(
                        "/bootstrap/newWeaken.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                    ns.tprint("Moving to next target...");
                    // await ns.sleep(500);
                } else if (
                    ns.getServerMoneyAvailable(hackTarget) <
                        ns.getServerMaxMoney(hackTarget) * 0.8 &&
                    freeRam >= growRam
                ) {
                    let threadCount = Math.floor(server.maxRam / growRam);
                    ns.tprint("Executing grow on ", server.hostname);
                    // await ns.sleep(500);
                    ns.exec(
                        "/bootstrap/newGrow.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                    ns.tprint("Moving to next target...");
                    // await ns.sleep(500);
                } else if (freeRam >= hackRam) {
                    let threadCount = Math.floor(server.maxRam / hackRam);
                    ns.tprint("Executing hack on ", server.hostname);
                    // await ns.sleep(500);
                    ns.exec(
                        "/bootstrap/newHack.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                    ns.tprint("Moving to next target...");
                    // await ns.sleep(500);
                }
            } else {
                ns.tprint(server.hostname, " cannot be accessed at this time.");
            }
        }
    }
}
