/** @param {NS} ns */
export async function main(ns) {
    for (let i = 0; i < 1; i++) {
        await ns.grow(ns.args[0]);
    }
}
