import { injectable } from "inversify";

/**
 * An in-memory storage option that uses a Map object to store and hold key-value pairs.
 */
class InMemoryStorage implements Storage {
  private data = new Map<string, string>();

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(String(key)) ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(String(key));
  }

  key(index: number): string | null {
    return [...this.data.keys()][Number(index)] ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(String(key), String(value));
  }

  get length(): number {
    return this.data.size;
  }
}

/**
 * Returns a reference to LocalStorage if access is available,
 * otherwise an InMemoryStorage instance is used instead.
 *
 * Firefox throws a SecurityError (or it is null) when it is not available.
 * @see https://github.com/GoogleChrome/web.dev/pull/2536
 */
function getLocalStorage(): Storage {
  let cand: Storage = new InMemoryStorage();
  try {
    cand = window.localStorage;
  } catch (e) {
    // ignore
  }
  return cand;
}

/**
 * A wrapper for LocalStorage and SessionStorage
 * @description This Web Storage API interface provides access to a particular domain's session or local storage. It allows, for example, the addition, modification, or deletion of stored data items.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
 * */
@injectable()
export abstract class AbstractStorage<T extends string> {
  private _storage: Storage;
  /**
   * Returns the number of key/value pairs currently present in the list associated with the object.
   */
  readonly length: number = 0;

  constructor(getStorage = getLocalStorage) {
    this._storage = getStorage();
  }

  /**
   * Empties the list associated with the object of all key/value pairs, if there are any.
   */
  protected clear(): void {
    this._storage.clear();
  }

  /**
   * Returns the current value associated with the given key, or null if the given key does not exist in the list associated with the object.
   */
  protected getItem(key: T): string | null {
    return this._storage.getItem(key);
  }

  /**
   * Returns the name of the nth key in the list, or null if n is greater than or equal to the number of key/value pairs in the object.
   */
  protected key(index: number): string | null {
    return this._storage.key(index);
  }

  /**
   * Removes the key/value pair with the given key from the list associated with the object, if a key/value pair with the given key exists.
   */
  protected removeItem(key: T): void {
    this._storage.removeItem(key);
  }

  protected clearItems(keys: T[]): void {
    keys.forEach((key) => this.removeItem(key));
  }

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   */
  protected setItem(key: T, value: string): void {
    this._storage.setItem(key, value);
  }
}
