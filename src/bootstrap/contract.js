/** @param {NS} ns */
export async function main(ns) {
    let servers = JSON.parse(ns.read("serverList.txt"));
    for (let server of servers) {
        for (let file of ns.ls(server.hostname, ".cct")) {
            ns.tprint(`${server.hostname}; ${file}`);
        }
    }
}
