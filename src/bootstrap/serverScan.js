/** @param {NS} ns */
export async function main(ns) {
    let servers = [
        {
            ...ns.getServer("home"),
            parent: "",
            scanned: false,
        },
    ];
    while (servers.filter((s) => !s.scanned).length >= 1) {
        let unscannedServer = servers.findIndex((s) => !s.scanned);
        let filteredServers = ns.scan(servers[unscannedServer].hostname);
        //.filter((s) => !servers.find((t) => s.hostname == t.hostname));
        servers[unscannedServer].scanned = true;
        for (let newServer of filteredServers) {
            if (servers.find((s) => s.hostname == newServer)) {
                continue;
            }
            servers.push({
                ...ns.getServer(newServer),
                parent: servers[unscannedServer].hostname,
                scanned: false,
            });
            ns.tprint(newServer);
        }
        await ns.sleep(20);
    }
    ns.write("serverList.txt", JSON.stringify(servers), "w");
    ns.tprint(servers);
}
