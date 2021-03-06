import { Serializable } from "@/shared/core/serialize/serializable";
import { shallowEqual } from "@/shared/core/shallowEqual";
/**
 *
 */
interface ValueObjectProps {
  [index: string]: any;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<
  T extends ValueObjectProps
> extends Serializable {
  public readonly props: T;

  constructor(props: T) {
    super();
    this.props = Object.freeze(props);
  }

  public equals(obj?: ValueObject<T>): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }
    if (obj.props === undefined) {
      return false;
    }
    return shallowEqual(this.props, obj.props);
  }
}
