export class Queue<T> {
    constructor(public items: T[] = []) { }

    public enqueue(item: T): number {
        return this.items.push(item)
    }
    public dequeue() {
        return this.items.shift();
    }

    public peek():T {
        return this.items[0]
    }

    public getItems(): T[] {
        return [...this.items]
    }
    get length() {
        return this.items.length
    }
}