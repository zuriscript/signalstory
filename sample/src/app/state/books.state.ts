export interface BookData {
  id: string;
  volumeInfo: {
    title: string;
    authors: Array<string>;
    publishedDate: string;
  };
}

export interface BookUI {
  isInCollection: boolean;
}

export type Book = BookData & BookUI;
