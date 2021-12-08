export class Identifer<T> {
  constructor(private _value: T) {}

  equals(id: Identifer<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return;
    }

    return id.toValue() === this._value;
  }

  toString() {
    return String(this._value);
  }

  toValue(): T {
    return this._value;
  }
}
