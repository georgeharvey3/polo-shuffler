export type SheetsData = {
  name: string;
  'points total': string;
  WINS: string;
  TIES: string;
  LOSSES: string;
  'avg. pts per game': string;
}[]

export type Player = {
  name: string;
  points: number;
  pointsPerGame: number;
}