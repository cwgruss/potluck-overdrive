export interface IResult<T, E> {
  isOk(): boolean;
  isFail(): boolean;

  unwrap(): T | never;
  unwrapFail(): E | never;

  map<M>(fn: (value: T) => M): IResult<M, E>;

  mapFail<M>(fn: (err: E) => M): IResult<T, M>;
}
