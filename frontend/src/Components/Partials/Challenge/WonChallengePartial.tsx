import * as React from 'react';
import { FunctionComponent } from 'react';
import { UserProfile, Wager } from '@/schema';
import { Alert, Button, Card } from 'flowbite-react';
import { Link } from '@inertiajs/react';

type Props = {
  challenge: Wager;
  user: UserProfile;
};
const WonChallengePartial: FunctionComponent<Props> = ({ challenge }) => {
  return (
    <Card className="max-w-xl text-center mx-auto">
      <Alert color="success" className="text-xl font-semibold">
        You won this challenge! ({challenge.challenger_gamer_tag} vs{' '}
        {challenge.respondent_gamer_tag})
      </Alert>

      {challenge.winner_paid ? (
        <h3 className="text-white text-lg">
          Thanks for playing, set up your next challenge
        </h3>
      ) : (
        <p className="text-white font-extrabold">
          We are in the process of sending over your PayPal payout.
        </p>
      )}

      <p className="text-gray-400 text-center text-sm tracking-tight">
        Want to browse through existing active challenges? Head over to our{' '}
        <a href="https://https://discord.com/channels/1173680090371068006" target="_blank" className="underline">
          Agora Discord channel
        </a>{' '}
        to find a challenge that you can take on!
      </p>
      <div className="flex items-center space-x-4">
        <Button
          className="w-full"
          color="blue"
          as={Link as any}
          href={`/challenge`}
        >
          Create New Challenge
        </Button>
      </div>
    </Card>
  );
};

export default WonChallengePartial;
