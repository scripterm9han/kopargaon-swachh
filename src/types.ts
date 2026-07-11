export type WasteMaterialType = 'plastic' | 'paper' | 'glass' | 'metal' | 'e-waste' | 'organic' | 'mixed' | 'other';

export interface WasteAnalysis {
  item_name: string;
  material_type: WasteMaterialType;
  recyclable: boolean;
  confidence: number;
  disposal_instructions: string;
  hazard_flag: boolean;
  notes: string | null;
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  items: number;
}
