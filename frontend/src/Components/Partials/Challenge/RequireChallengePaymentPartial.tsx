import * as React from 'react';
import { Card } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager } from '@/schema';
import { PaynoteButton } from '@/Components/PaynoteButton';

type Props = {
  challenge: Wager;
  user: UserProfile;
};
const RequireChallengePaymentPartial: React.FC<Props> = ({
  challenge,
  user,
}) => {
  const payload = {
    checkout: {
      totalValue: challenge.amount,
      currency: 'USD',
      description: 'Wager Payment',
      items: [{ title: 'Wager', price: challenge.amount }],
      customerEmail: user.email,
      customerFirstName: user.first_name,
      customerLastName: user.last_name,
    },
  };

  return (
    <Card className="max-w-xl text-center mx-auto">
      <h3 className="text-white font-medium text-sm">Stake Your Claim</h3>
      <p className="text-gray-400 text-xs">
        One last step before you get started - you both need to make the wager
        payment agreed to for the challenge. The winner will receive the below
        payout after you play!
      </p>

      <div className="bg-dark rounded-full p-2 text-lg text-white flex items-center justify-center">
        <span className="bg-green-400 rounded-full p-1 flex items-center justify-center mr-2">
          <BanknotesIcon className="h-5 w-5" />
        </span>
        <h1>
          {currencyFormatter.format(Number(challenge.amount))} To Win{' '}
          {currencyFormatter.format(Number(challenge.amount * 1.8))}
        </h1>
      </div>

      {user.user === challenge.challenger_id ? (
        <p className="text-gray-400 text-xs mt-2">
          You challenged {challenge.challenger_gamer_tag} to this wager.
          Awaiting their payment.
        </p>
      ) : (
        <p className="text-gray-400 text-xs mt-2">
          {challenge.challenger_gamer_tag} challenged you to this wager. Pay{' '}
          {currencyFormatter.format(challenge.amount)} to accept.
        </p>
      )}

      <PaynoteButton
        payload={payload}
        onSuccess={() => {
          console.log('onSuccessCallback');
        }}
        onError={() => {
          console.log('onErrorCallback');
        }}
      />
    </Card>
  );
};

export default RequireChallengePaymentPartial;
