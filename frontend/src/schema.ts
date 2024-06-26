export enum WagerStatus {
  ACCEPTED = 'Accepted', // active
  IN_PROGRESS = 'In Progress', // active
  AWAITING_RESPONSE = 'Awaiting Response', // active
  DISPUTED = 'Disputed', // active
  COMPLETED = 'Completed',
  EXPIRED = 'Expired',
}

export type Wager = {
  id: number;
  challenger_id: number;
  respondent_id: number | null;
  amount: number; // Assuming this represents a decimal
  game: Game;
  notes: string | null;
  unique_code: string;
  gamer_tag: string | null;
  challenger_gamer_tag: string | null;
  respondent_gamer_tag: string | null;
  status: WagerStatus;
  created_at: Date;
  updated_at: Date;
  challenger_vote: string | null;
  respondent_vote: string | null;
  challenger?: UserProfile;
  respondent?: UserProfile;
  challenger_paid: boolean;
  respondent_paid: boolean;
  winner_paid: boolean;
  winner_paypal: string;
  winner?: UserProfile;
  winner_id?: number | null;
};

export type UserProfile = {
  user: number; // Assuming this is a numeric ID representing the foreign key to 'User'
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  state: string;
  phone_number: string;
  birthday: Date;
  created_at: Date;
  updated_at: Date;
  verification_id: string;
  acct_verified: boolean;
  paynote_id: string;
  winnings: number; // Assuming this represents a decimal
};

export type Pagination<T> = {
  result: T[];
  total_amount: number;
  current_page: number;
  total_pages: number;
};

export type Game = {
  game: string;
  platform: string;
  terms: string;
  slug: string;
  discord_link: string;
};

export type GameTerms = {
  term: string;
  discord_link: string;
};

export type GameInfo = {
  terms: GameTerms[];
  platforms: string[];
};

export type GameChoice = {
  [key: string]: GameInfo;
};
