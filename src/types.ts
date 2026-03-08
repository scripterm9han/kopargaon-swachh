export type WasteCategory = 'Recyclable' | 'Organic' | 'Non-Recyclable' | 'E-Waste' | 'Hazardous';

export interface WasteAnalysis {
  itemName: string;
  category: WasteCategory;
  binColor: 'Blue' | 'Green' | 'Black' | 'Red';
  disposalInstruction: string;
  environmentalTip: string;
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  items: number;
}
