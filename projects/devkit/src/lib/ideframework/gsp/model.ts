let nextInstanceId = 1;

export class Model {
  alive = true;
  get isAlive() { return this.alive; }
  get isDestroyed() { return !this.alive; }

  constructor(params: any) {

  }

  assignId(id) {

  }

  destroy() {

  }

  resetNextInstanceId() {
    nextInstanceId = 1;
  }
}
