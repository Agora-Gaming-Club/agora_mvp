import * as React from 'react';
import { FormEventHandler, FunctionComponent, useState } from 'react';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import { useForm } from '@inertiajs/react';
import Cookies from 'js-cookie';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager } from '@/schema';

const AcceptChallengePartial: FunctionComponent<{
  challenge: Wager;
  user: UserProfile;
}> = ({ challenge, user }) => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post } = useForm({
    respondent_gamer_tag: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
    accept: true,
  });
  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(`/challenge/${challenge.unique_code}`, {
      onError: (err) => {
        console.log(err);
        setFormErrors(transformErrors(err));
      },
      onSuccess: () => location.reload(),
      only: ['errors', 'challenge'],
    });
  };

  return (
    <Card className="max-w-xl text-center mx-auto p-1 sm:p-5">
      <div className="mt-6">
        <dl className="space-y">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-white">
              Challenger
            </dt>
            <dd className="mt-1 leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              @{challenge.challenger_gamer_tag}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-white">Game</dt>
            <dd className="mt-1 leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              {challenge.game.game}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-white">
              Platform
            </dt>
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

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="password" value="Gamer Tag" />

          <TextInput
            id="gamerTag"
            value={data.respondent_gamer_tag}
            onChange={(e) => setData('respondent_gamer_tag', e.target.value)}
            type="text"
            className="mt-1 w-full"
            placeholder="Enter your Gamer Tag"
            required
            color={formErrors?.errors.respondent_gamer_tag ? 'failure' : 'gray'}
            helperText={formErrors?.errors.respondent_gamer_tag ?? ''}
          />
        </div>

        <div>
          <Button className="w-full" type="submit" color="blue">
            Accept Challenge
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AcceptChallengePartial;
