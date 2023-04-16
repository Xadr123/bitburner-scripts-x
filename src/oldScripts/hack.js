/** @param {NS} ns */
export async function main(ns) {
    for (let i = 0; i < 1; i++) {
        await ns.hack(ns.args[0]);
    }
}
