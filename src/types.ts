export type Schema = Map<
  string,
  {
    name: string;
    cid: number;
    type: string;
    notnull: number;
    dflt_value: string;
    pk: number;
  }[]
>;
