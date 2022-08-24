type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : T[K] extends Record<string, unknown>
    ? RecursivePartial<T[K]>
    : T[K];
};

export const mockPartial = <T>(partial?: RecursivePartial<T>): T =>
  partial as never;
