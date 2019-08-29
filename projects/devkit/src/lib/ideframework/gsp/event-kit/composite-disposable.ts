import { Disposable } from './disposable';

// Essential: An object that aggregates multiple {Disposable} instances together
// into a single disposable, so they can all be disposed as a group.
//
// These are very useful when subscribing to multiple events.
//
// ## Examples
//
// ```coffee
// {CompositeDisposable} = require 'atom'
//
// class Something
//   constructor: ->
//     @disposables = new CompositeDisposable
//     editor = atom.workspace.getActiveTextEditor()
//     @disposables.add editor.onDidChange ->
//     @disposables.add editor.onDidChangePath ->
//
//   destroy: ->
//     @disposables.dispose()
// ```
export class CompositeDisposable {
  private disposed = false;
  private disposables: Set<any>;

  //////
  /// Section: Construction and Destruction
  //////

  // Public: Construct an instance, optionally with one or more disposables
  constructor(...disposables) {
    this.disposables = new Set();
    this.add(...disposables);
  }
  // Public: Dispose all disposables added to this composite disposable.
  //
  // If this object has already been disposed, this method has no effect.
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      this.disposables.forEach((disposable) => disposable.dispose());
      this.disposables = null;
    }
  }
  //////
  /// Section: Managing Disposables
  //////

  // Public: Add disposables to be disposed when the composite is disposed.
  //
  // If this object has already been disposed, this method has no effect.
  //
  // * `...disposables` {Disposable} instances or any objects with `.dispose()`
  //   methods.
  add(...disposables) {
    if (!this.disposed) {
      for (const disposable of disposables) {
        if (this.assertDisposable(disposable)) {
          this.disposables.add(disposable);
        }
      }
    }
  }
  // Public: Remove a previously added disposable.
  //
  // * `disposable` {Disposable} instance or any object with a `.dispose()`
  //   method.
  remove(disposable): void {
    if (!this.disposed) {
      this.disposables.delete(disposable);
    }
  }
  // Public: Alias to {CompositeDisposable::remove}
  delete(disposable): void {
    this.remove(disposable);
  }
  // Public: Clear all disposables. They will not be disposed by the next call
  // to dispose.
  clear() {
    if (!this.disposed) {
      this.disposables.clear();
    }
  }

  assertDisposable(disposable): boolean {
    if (!Disposable.isDisposable(disposable)) {
      throw new TypeError('Arguments to CompositeDisposable.add must have a .dispose() method');
    }
    return true;
  }
}
