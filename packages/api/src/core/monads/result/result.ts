import { IResult } from "./result.interface";

export abstract class Result<TOk, TFail> implements IResult<TOk, TFail> {
  public static ok<TOk, TFail>(value: TOk): IResult<TOk, TFail> {
    return new OkResult<TOk, TFail>(value);
  }

  public static fail<TOk, TFail>(value: TFail): IResult<TOk, TFail> {
    return new FailResult<TOk, TFail>(value);
  }

  isOk(): boolean {
    throw new Error("Method not implemented.");
  }
  isFail(): boolean {
    throw new Error("Method not implemented.");
  }
  unwrap(): TOk {
    throw new Error("Method not implemented.");
  }
  unwrapFail(): TFail {
    throw new Error("Method not implemented.");
  }

  map<M>(fn: (value: TOk) => M): IResult<M, TFail> {
    throw new Error("Method not implemented.");
  }

  mapFail<M>(fn: (err: TFail) => M): IResult<TOk, M> {
    throw new Error("Method not implemented.");
  }
}

export class OkResult<TOk, TFail> extends Result<TOk, TFail> {
  constructor(private readonly successValue: TOk) {
    super();
  }

  isOk(): this is OkResult<TOk, TFail> {
    return true;
  }

  isFail(): this is FailResult<TOk, TFail> {
    return false;
  }

  unwrap(): TOk {
    return this.successValue;
  }

  unwrapFail(): never {
    throw new ReferenceError("Cannot unwrap a success as a failure");
  }

  map<M>(fn: (value: TOk) => M): IResult<M, TFail> {
    return Result.ok<M, TFail>(fn(this.successValue));
  }

  mapFail<M>(): IResult<TOk, M> {
    return Result.ok(this.successValue);
  }
}

export class FailResult<TOk, TFail>
  extends Result<TOk, TFail>
  implements IResult<TOk, TFail>
{
  constructor(private readonly failureValue: TFail) {
    super();
  }

  isOk(): this is OkResult<TOk, TFail> {
    return false;
  }

  isFail(): this is FailResult<TOk, TFail> {
    return true;
  }

  unwrap(): TOk {
    throw new Error("Cannot unwrap a failure");
  }

  unwrapFail(): TFail {
    return this.failureValue;
  }
}
