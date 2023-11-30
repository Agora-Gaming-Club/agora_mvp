type WagerStatus =
  | 'challenger_wins'
  | 'respondent_wins'
  | 'accepted' // active
  | 'in_progress' // active
  | 'awaiting_response' // active
  | 'disputed' // active
  | 'completed'
  | 'expired';

type Wager = {
  id: number;
  challenger_id: number;
  respondent_id: number | null;
  amount: number; // Assuming this represents a decimal
  game: string | number; // Assuming this is a numeric ID representing the foreign key to 'Game'
  notes: string | null;
  unique_code: string;
  gamer_tag: string | null;
  status: WagerStatus;
  created_at: Date;
  updated_at: Date;
  challenger_vote: string | null;
  respondent_vote: string | null;
};

type UserProfile = {
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
  winnings: number; // Assuming this represents a decimal
};
