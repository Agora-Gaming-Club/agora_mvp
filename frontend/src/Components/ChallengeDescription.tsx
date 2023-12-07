import { FunctionComponent, PropsWithChildren } from 'react';
import { Wager } from '@/schema';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import * as React from 'react';
import { Card } from 'flowbite-react';

type Props = {
  challenge: Wager;
};
const ChallengeDescription: FunctionComponent<PropsWithChildren<Props>> = ({
  challenge,
  children,
}) => {
  return (
    <div className="mt-6">
      <dl className="space-y">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-white">
            Challenger GamerTag
          </dt>
          <dd className="mt-1 leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
            @{challenge.challenger_gamer_tag}
          </dd>
        </div>
        {challenge.respondent_gamer_tag && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-white">
              Respondent GamerTag
            </dt>
            <dd className="mt-1 leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              @{challenge.respondent_gamer_tag}
            </dd>
          </div>
        )}
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-white">Game</dt>
          <dd className="mt-1 leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
            {challenge.game.game}
          </dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-white">Platform</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
            {challenge.game.platform}
          </dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-white">
            Game Mode
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
            {challenge.game.terms}
          </dd>
        </div>

        <div className="bg-dark rounded-full p-2 text-lg text-white flex items-center justify-center">
          <span className="bg-green-400 rounded-full p-1 flex items-center justify-center mr-2">
            <BanknotesIcon className="h-5 w-5" />
          </span>
          <h1>
            Pay {currencyFormatter.format(Number(challenge.amount))}, Win{' '}
            {currencyFormatter.format(Number(challenge.amount * 1.8))}
          </h1>
        </div>
      </dl>
    </div>
  );
};

export default ChallengeDescription;
