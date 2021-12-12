import { permute } from 'src/core/permutations/permute';
import { Index } from './Index.model';
import { filter } from 'lodash';

const sortIndexesASC = <T extends Index>(indexes: T[]): T[] => {
  const copy = indexes.slice();
  return copy.sort((itemA, itemB) => {
    if (itemA.value < itemB.value) {
      return -1;
    }

    if (itemA.value === itemB.value) {
      return 0;
    }

    if (itemA.value > itemB.value) {
      return 1;
    }
  });
};

export class IndexHashMap<T extends Index> {
  static INDEX_SEPERATOR: string = ':';
  private _indexes: T[] = [];

  constructor(indexes: T[] = []) {
    this._indexes = sortIndexesASC(indexes);
  }

  addIndex(index: T): void {
    this._indexes.push(index);
    this._indexes = sortIndexesASC(this._indexes);
  }

  removeIndex(index: T): void {
    const updatedArr = filter(this._indexes, (item) => item.equals(index));
    this._indexes = updatedArr;
  }

  toHashCode(): string {
    const hashes = this._indexes.map((index) => index.toHashCode());
    return hashes.join(IndexHashMap.INDEX_SEPERATOR);
  }

  getPermutations(): Array<T[]> {
    const result = permute(this._indexes, (arr, item) => {
      return arr.some((el) => el.equals(item));
    });

    return result;
  }
}
