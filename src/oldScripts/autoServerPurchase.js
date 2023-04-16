/** @param {NS} ns */
export async function main(ns) {
    let ram = 64;
    while (true) {
        await ns.sleep(60000);
        for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
            if (
                ns.getServerMoneyAvailable("home") >=
                ns.getPurchasedServerCost(ram)
            ) {
                ns.purchaseServer("worker-" + i, ram);
            }
        }
    }
}
