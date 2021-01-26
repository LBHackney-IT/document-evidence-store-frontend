export type TokenDictionary = {
  [key: string]:
    | {
        [method: string]: string | undefined;
      }
    | undefined;
};
