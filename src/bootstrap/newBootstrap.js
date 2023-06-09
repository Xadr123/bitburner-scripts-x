/** @param {NS} ns */
export async function main(ns) {
    let servers = JSON.parse(ns.read("serverList.txt"));
    ns.disableLog("getHackingLevel");
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
        let hackTarget = servers
            .filter(
                (s) =>
                    s.hasAdminRights &&
                    s.requiredHackingSkill <= ns.getHackingLevel() &&
                    s.openPortCount >= s.numOpenPortsRequired
            )
            .sort((a, b) => (a.moneyMax > b.moneyMax ? -1 : 1))[0].hostname;
        for (let server of servers.sort((a, b) =>
            a.maxRam > b.maxRam ? -1 : 1
        )) {
            let serverPosition = servers.findIndex(
                (s) => s.hostname == server.hostname
            );
            if (server.numOpenPortsRequired >= server.openPortCount) {
                ns.print("Target: ", server.hostname);
                if (ns.fileExists("BruteSSH.exe") && !server.sshPortOpen) {
                    ns.print(
                        server.openPortCount,
                        " open ports, accessing new ports..."
                    );
                    ns.brutessh(server.hostname);
                    servers[serverPosition].sshPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.print("SSH port opened on ", server.hostname);
                }
                if (ns.fileExists("FTPCrack.exe") && !server.ftpPortOpen) {
                    ns.ftpcrack(server.hostname);
                    servers[serverPosition].ftpPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.print("FTP port opened on ", server.hostname);
                }
                if (ns.fileExists("relaySMTP.exe") && !server.smtpPortOpen) {
                    ns.relaysmtp(server.hostname);
                    servers[serverPosition].smtpPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.print("SMTP port opened on ", server.hostname);
                }
                if (ns.fileExists("HTTPWorm.exe") && !server.httpPortOpen) {
                    ns.httpworm(server.hostname);
                    servers[serverPosition].httpPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.print("HTTP port opened on ", server.hostname);
                }
                if (ns.fileExists("SQLInject.exe") && !server.sqlPortOpen) {
                    ns.sqlinject(server.hostname);
                    servers[serverPosition].sqlPortOpen = true;
                    servers[serverPosition].openPortCount++;
                    ns.print("SQL port opened on ", server.hostname);
                }
                if (server.numOpenPortsRequired <= server.openPortCount) {
                    ns.nuke(server.hostname);
                    servers[serverPosition].hasAdminRights = true;
                    ns.write("serverList.txt", JSON.stringify(servers), "w");
                }
            }
            if (
                server.requiredHackingSkill <= ns.getHackingLevel() &&
                servers[serverPosition].hasAdminRights
            ) {
                ns.print("Server accessed, injecting and executing scripts.");
                ns.scp(scriptFiles, server.hostname, "home");
                let freeRam = server.maxRam - server.ramUsed - 8;
                let batchRam = Math.floor(freeRam / 3);
                if (freeRam >= hackRam) {
                    let threadCount = Math.floor(batchRam / hackRam);
                    ns.print("Executing hack on ", server.hostname);
                    ns.exec(
                        "/bootstrap/newHack.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                    ns.print("Moving to next target...");
                }
                if (freeRam >= growRam) {
                    let threadCount = Math.floor(batchRam / growRam);
                    ns.print("Executing grow on ", server.hostname);
                    ns.exec(
                        "/bootstrap/newGrow.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                }
                if (freeRam >= weakenRam) {
                    let threadCount = Math.floor(batchRam / weakenRam);
                    ns.print("Executing weaken on ", server.hostname);
                    ns.exec(
                        "/bootstrap/newWeaken.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                    await ns.sleep(100);
                }
            } else {
                ns.print(server.hostname, " cannot be accessed at this time.");
            }
        }
    }
}
