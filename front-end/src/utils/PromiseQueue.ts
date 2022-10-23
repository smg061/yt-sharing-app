
type QueuedPromise = {
    promise: () => Promise<any>
    resolve: (resolve: void | PromiseLike<void>) => void,
    reject: (reason?: any) => void
}
export class PromiseQueue {
    private promisePending: boolean = false;
    constructor(private queue: QueuedPromise[] = []) { }

    enqueue(promise: () => Promise<any>) {
        return new Promise<any>((resolve, reject) => {
            this.queue.push({
                resolve,
                reject,
                promise,
            })
            //if(!this.promisePending)
            this.dequeue();
        })
    }

    dequeue() {
        if (this.promisePending) {
            return false;
        }
        const item = this.queue.shift();

        if (!item) {
            return false;
        }
        try {
            this.promisePending = true;
            item.promise().then((value) => {
                this.promisePending = false;
                item.resolve(value)
                this.dequeue()
            }).catch((error) => {
                this.promisePending = false;
                item.reject(error);
                this.dequeue();
            })
        } catch (error) {
            this.promisePending = false;
            item.reject(error);
            this.dequeue();
        }
    }

}

export function delayFunc<T>(func: (args: T) => void, args: T, delay: number) {
    const p = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            func(args)
            resolve()
        }, delay)
    })
    return () => p
}