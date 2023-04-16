/** @param {NS} ns */
export async function main(ns) {
    for (let i = 0; i < 2; i++) {
        await ns.weaken(ns.args[0]);
    }
}
