export interface ListingFieldOption {
  readonly value: string;
  readonly labelAr: string;
  readonly labelEn: string;
}

export interface ListingField {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly type: 'text' | 'number' | 'select' | 'boolean' | 'cascading-model';
  readonly required: boolean;
  readonly options?: readonly ListingFieldOption[];
  readonly allowOther?: boolean;
  readonly multiSelect?: boolean;
  readonly placeholder?: string;
  readonly placeholderAr?: string;
  readonly dependsOn?: string;
}

export type CategoryFieldMap = Record<string, readonly ListingField[]>;
export type ListingFieldsMap = Record<string, CategoryFieldMap>;
