interface EventHandler {
    type: 'handle' | 'on' | 'once';
    func: (this: App, event: IpcMainEvent | IpcMainInvokeEvent, data: any) => any;
}

type AppStartupInfos = {
    version: string;
    platform: string;
} | null;