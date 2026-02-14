import ScannerCore from "#electron/structures/scannerCore";

console.log("Scanner worker started");
const parentPort = process.parentPort;

parentPort.on("message", async (e) => {
    const { type, payload } = e.data;

    if (type === "START") {
        const { directory, id } = payload;

        try {
            const core = new ScannerCore(payload.userDataFolder);

            await core.scan(directory, (data) => {
                // echo the ID back with progress
                parentPort.postMessage({
                    type: "PROGRESS",
                    payload: { id, ...data },
                });
            });

            parentPort.postMessage({
                type: "DONE",
                payload: { id },
            });
        } catch (error: any) {
            parentPort.postMessage({
                type: "ERROR",
                payload: { id, error: error.message },
            });
        }
    }
});