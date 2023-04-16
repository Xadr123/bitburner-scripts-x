/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        let servers = ns.scan("home"); //Pulls array of servers connected to home
        let targets = servers.filter((s) => ns.getServer(s).hasAdminRights); //Filters and returns servers that can be hacked.
        let growRam = ns.getScriptRam("grow.js", "home"); //Gets grow script RAM size
        let weakenRam = ns.getScriptRam("weaken.js", "home"); //Gets weaken script RAM size
        let hackRam = ns.getScriptRam("hack.js", "home"); //Gets hack script RAM size
        let serverTarget = "iron-gym";
        let hackTimer = 250;
        for (let target of targets) {
            //Looping to run on each target
            let freeRam =
                ns.getServerMaxRam(target) - ns.getServerUsedRam(target); //Gets server available RAM
            ns.scp("grow.js", target, "home"); //Copies grow script from home to target server
            ns.scp("weaken.js", target, "home"); //Copies weaken script from home to target server
            ns.scp("hack.js", target, "home"); //Copies hack script from home to target server
            if (
                ns.getServerMinSecurityLevel(serverTarget) + 2 <
                    ns.getServerSecurityLevel(serverTarget) &&
                freeRam >= weakenRam
            ) {
                //Checks to see if the servers security level is higher than the minimum, and if enough RAM is available to run the script
                let threadCount = Math.floor(freeRam / weakenRam); //Gets the maximum amount of threads the script can run on, rounded DOWN.
                ns.exec("weaken.js", target, threadCount, serverTarget); //Runs the weaken script on the target server with maximum threads.
            } else if (
                ns.getServerMoneyAvailable(serverTarget) <
                    ns.getServerMaxMoney(serverTarget) * 0.8 &&
                freeRam >= growRam
            ) {
                //Checks to see if servers available money is lower than servers money limit and if enough RAM is available to run the script
                let threadCount = Math.floor(freeRam / growRam); //Gets the maximum amount of threads the script can run on, rounded DOWN.
                ns.exec("grow.js", target, threadCount, serverTarget); //Runs the grow script on the target server with maximum threads.
            } else if (freeRam >= hackRam) {
                //Check to see if enough RAM is available to run the script
                let threadCount = Math.floor(freeRam / hackRam); //Gets the maximum amount of threads the script can run on, rounded DOWN.
                ns.exec("hack.js", target, threadCount, serverTarget); //Runs the hack script on the target server with maximum threads.
            }
            await ns.sleep(hackTimer);
        }

        for (let subTargets of targets) {
            let subServers = ns.scan(subTargets);
            let subTargetServers = subServers.filter(
                (s) =>
                    ns.getServer(s).hasAdminRights &&
                    !ns.getServer(s).purchasedByPlayer
            );
            for (let subTarget of subTargetServers) {
                let freeRam =
                    ns.getServerMaxRam(subTarget) -
                    ns.getServerUsedRam(subTarget);
                ns.scp("grow.js", subTarget, "home");
                ns.scp("weaken.js", subTarget, "home");
                ns.scp("hack.js", subTarget, "home");
                if (
                    ns.getServerMinSecurityLevel(serverTarget) + 4 <
                        ns.getServerSecurityLevel(serverTarget) &&
                    freeRam >= weakenRam
                ) {
                    let threadCount = Math.floor(freeRam / growRam);
                    ns.exec("weaken.js", subTarget, threadCount, serverTarget);
                } else if (
                    ns.getServerMoneyAvailable(serverTarget) <
                        ns.getServerMaxMoney(serverTarget) * 0.8 &&
                    freeRam >= growRam
                ) {
                    let threadCount = Math.floor(freeRam / growRam);
                    ns.exec("grow.js", subTarget, threadCount, serverTarget);
                } else if (freeRam >= hackRam) {
                    let threadCount = Math.floor(freeRam / growRam);
                    ns.exec("hack.js", subTarget, threadCount, serverTarget);
                }
                await ns.sleep(hackTimer);
            }
        }
    }
}
