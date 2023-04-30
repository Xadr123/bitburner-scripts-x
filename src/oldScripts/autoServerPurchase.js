/** @param {NS} ns */
export async function main(ns) {
    let ram = 65536;
    while (true) {
        for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
            if (
                ns.getServerMoneyAvailable("home") >=
                ns.getPurchasedServerCost(ram)
            ) {
                ns.purchaseServer("worker-" + i, ram);
            }
        }
        await ns.sleep(20);
    }
}
