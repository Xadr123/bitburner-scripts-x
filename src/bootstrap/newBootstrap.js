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
    //Setup loop
    //Check each server to see if it can be hacked AND if it isnt hacked (Hacking level, Root access)
    //After, check to see if more than 0 ports are needed
    //If no ports are needed, connect to the server, and run NUKE.exe
    //If ports are needed, connect to the server, check to see if any port hacking files exist
    //Run all port hacking files that exist
    //Run NUKE.exe

    while (
        servers.filter(
            (s) =>
                s.requiredHackingSkill <= ns.getHackingLevel() &&
                !s.hasAdminRights
        ).length >= 1
    ) {
        let hackTarget = "n00dles";
        for (let server of servers) {
            let serverPosition = servers.findIndex(
                (s) => s.hostname == server.hostname
            );
            ns.tprint("Target: ", server.hostname);
            await ns.sleep(500);
            if (server.numOpenPortsRequired > 0 && server.openPortCount == 0) {
                if (ns.fileExists("BruteSSH.exe")) {
                    ns.tprint(
                        server.openPortCount,
                        " open ports, accessing new ports..."
                    );
                    ns.brutessh(server.hostname);
                    servers[serverPosition].openPortCount++;
                    ns.tprint("SSH port opened on ", server.hostname);
                }
                if (ns.fileExists("FTPCrack.exe")) {
                    ns.ftpcrack(server.hostname);
                    servers[serverPosition].openPortCount++;
                    ns.tprint("FTP port opened on ", server.hostname);
                }
                if (ns.fileExists("relaySMTP.exe")) {
                    ns.relaysmtp(server.hostname);
                    servers[serverPosition].openPortCount++;
                    ns.tprint("SMTP port opened on ", server.hostname);
                }
                if (ns.fileExists("HTTPWorm.exe")) {
                    ns.httpworm(server.hostname);
                    servers[serverPosition].openPortCount++;
                    ns.tprint("HTTP port opened on ", server.hostname);
                }
                if (ns.fileExists("SQLInject.exe")) {
                    ns.sqlinject(server.hostname);
                    servers[serverPosition].openPortCount++;
                    ns.tprint("SQL port opened on ", server.hostname);
                }
            }
            if (
                server.requiredHackingSkill <= ns.getHackingLevel() &&
                !server.hasAdminRights &&
                servers[serverPosition].openPortCount ==
                    server.numOpenPortsRequired
            ) {
                ns.nuke(server.hostname);
                servers[serverPosition].hasAdminRights = true;
                ns.tprint("Server accessed, injecting and executing scripts.");
                ns.scp(scriptFiles, server.hostname, "home");
                let freeRam = server.maxRam - server.ramUsed;
                ns.tprint(freeRam);
                ns.tprint(weakenRam);
                ns.tprint(freeRam / weakenRam);
                if (
                    ns.getServerMinSecurityLevel(hackTarget) + 4 <
                        ns.getServerSecurityLevel(hackTarget) &&
                    freeRam >= weakenRam
                ) {
                    let threadCount = Math.floor(server.maxRam / weakenRam);
                    ns.tprint(threadCount);
                    ns.exec(
                        "/bootstrap/newWeaken.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                } else if (
                    ns.getServerMoneyAvailable(hackTarget) <
                        ns.getServerMaxMoney(hackTarget) * 0.8 &&
                    freeRam >= growRam
                ) {
                    let threadCount = Math.floor(server.maxRam / growRam);
                    ns.exec(
                        "/bootstrap/newGrow.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                } else if (freeRam >= hackRam) {
                    let threadCount = Math.floor(server.maxRam / hackRam);
                    ns.exec(
                        "/bootstrap/newHack.js",
                        server.hostname,
                        threadCount,
                        hackTarget
                    );
                }
            } else if (server.hasAdminRights) {
                ns.tprint(server.hostname, " has already been accessed.");
                servers[serverPosition].hasAdminRights = true;
            } else {
                ns.tprint(server.hostname, " cannot be accessed at this time.");
            }
        }
    }
}
