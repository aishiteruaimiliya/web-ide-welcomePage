export class ItemRegistry {
  items: WeakSet<any>;
  constructor() {
    this.items = new WeakSet();
  }

  addItem(item: any) {
    if (this.hasItem(item)) {
      throw new Error(`The workspace can only contain one instance of item ${item}`);
    }
    this.items.add(item);
  }

  removeItem(item: any) {
    this.items.delete(item);
  }

  hasItem(item) {
    return this.items.has(item);
  }
}
