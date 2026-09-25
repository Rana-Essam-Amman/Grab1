export interface UseAiReviewReturn {
  title: string; price: string; city: string; description: string; photos: string[];
  addPhotos: (newPhotos: string[]) => void; removePhoto: (index: number) => void;
  neighborhood: string; setNeighborhood: (n: string) => void;
  setTitle: (t: string) => void; setPrice: (p: string) => void;
  setCity: (c: string) => void; setDescription: (d: string) => void;
  attributes: readonly {
    key: string;
    label: string;
    value: string;
    required?: boolean;
    type?: 'text' | 'number' | 'select' | 'textarea';
    options?: readonly string[];
  }[];
  setAttributeValue: (key: string, value: string) => void;
  handlePublish: () => Promise<void>; isPublishing: boolean; hasMissingParams: boolean;
  readonly missingRequiredLabels: readonly string[]; error?: string | null;
}
