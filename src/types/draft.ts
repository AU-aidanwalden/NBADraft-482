export interface DraftPick {
  pick: number | "-" | null;
  player: string | null;
  team: string | null;
  player_id: number;
  team_id: number;
  round?: number;
  roundIndex?: number;
  _originalId: string;
  isForfeited?: boolean; // optional
}
