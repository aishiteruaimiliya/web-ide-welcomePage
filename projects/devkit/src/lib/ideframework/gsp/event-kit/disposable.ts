// Essential: A handle to a resource that can be disposed. For example,
// {Emitter::on} returns disposables representing subscriptions.

export class Disposable {

  private disposed = false;

  // Public: Ensure that `object` correctly implements the `Disposable`
  // contract.
  //
  // * `object` An {Object} you want to perform the check against.
  //
  // Returns a {Boolean} indicating whether `object` is a valid `Disposable`.
  static isDisposable(object): boolean {
    if (object && object.dispose && typeof(object.dispose) === 'function') {
      return true;
    }
    return false;
  }
  //////
  /// Section: Construction and Destruction
  //////

  // Public: Construct a Disposable
  //
  // * `disposalAction` A {Function} to call when {::dispose} is called for the
  //   first time.
  constructor(private disposalAction: () => any) { }

  // Public: Perform the disposal action, indicating that the resource associated
  // with this disposable is no longer needed.
  //
  // You can call this method more than once, but the disposal action will only
  // be performed the first time.
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      if (this.disposalAction) {
        this.disposalAction();
      }
      this.disposalAction = null;
    }
  }
}
