export class Queue<T> {
    constructor(public items: T[] = []) { }
    
    get length() {
        return this.items.length
    }

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

    public isEmpty() {
        return this.items.length === 0
    }
}