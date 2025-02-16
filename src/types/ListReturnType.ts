export interface ListReturnType<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
