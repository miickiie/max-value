export interface Item {
  id: string;
  name: string;
  size: string;
  price: string;
}

export interface ComparisonResult extends Item {
  unitPrice: number;
  isBest: boolean;
  savingsPercent: number; // Compared to the most expensive item or relative to others
  originalIndex: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  productName?: string;
  items: Item[];
}
