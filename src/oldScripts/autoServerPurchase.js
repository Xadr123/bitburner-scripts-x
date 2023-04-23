/** @param {NS} ns */
export async function main(ns) {
    let ram = 1024;
    while (true) {
        for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
            if (
                ns.getServerMoneyAvailable("home") >=
                ns.getPurchasedServerCost(ram)
            ) {
                ns.purchaseServer("worker-" + i, ram);
            }
        }
        break;
    }
}
