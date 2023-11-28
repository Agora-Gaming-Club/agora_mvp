type WagerStatus =
  | 'challenger_wins'
  | 'respondent_wins'
  | 'accepted'
  | 'in_progress'
  | 'awaiting_response'
  | 'completed'
  | 'disputed'
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
