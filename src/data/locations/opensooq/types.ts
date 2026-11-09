export interface OpensooqArea {
  readonly slug: string;
  readonly nameAr: string;
}

export interface OpensooqCity {
  readonly slug: string;
  readonly nameAr: string;
  readonly areas: readonly OpensooqArea[];
}
