// Pickers: the small, cached list behind "pick a machine" or "pick a hold reason".
// docs/admin-lists-and-pickers.md

/** One entry a picker shows. */
export interface AppOption {
  /** A record's id, or a value list value's code: what a record stores. */
  id: string;
  label: string;
  /** A second line (a machine's stage), when the type declares one. */
  sublabel?: string;
  /** Switched off: hide it for new choices, still show its label on records that carry it. */
  active: boolean;
  /** Its place, when the type or list has one; entries come sorted already. */
  order: number | null;
}

export type AppOptionsResponse =
  /** `all`: every entry. `search`: the type is too large to send whole; these match `q`. */
  | { items: AppOption[]; version: string; mode: 'all' | 'search'; total?: number; unchanged?: undefined }
  /** You already hold this version. */
  | { unchanged: true; version: string };

/** A value to save in a value list, in the order to show them. */
export interface AppOptionValueInput {
  code: string;
  label?: string;
  active?: boolean;
}
