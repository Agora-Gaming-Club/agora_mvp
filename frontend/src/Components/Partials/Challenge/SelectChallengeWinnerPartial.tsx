import { FormEventHandler, FunctionComponent, useState } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import * as React from 'react';
import { UserProfile, Wager } from '@/schema';
import { classNames } from '@/Utils/styles';
import { RadioGroup } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

type Props = {
  challenge: Wager;
  user: UserProfile;
};

type Option = {
  id: any;
  username?: any;
  gamer_tag?: any;
};

const SelectChallengeWinnerPartial: FunctionComponent<Props> = ({
  challenge,
  user,
}) => {
  const [selected, setSelected] = useState();
  const options: Option[] = [
    {
      id: challenge.challenger_id,
      username: challenge.challenger?.username,
      gamer_tag: challenge.challenger_gamer_tag,
    },
    {
      id: challenge.respondent_id,
      username: challenge.respondent?.username,
      gamer_tag: challenge.respondent_gamer_tag,
    },
  ];

  const { data, setData, post } = useForm({
    winner: '',
  });
  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    console.log(data);
    // post(`/challenge/${challenge.unique_code}`, {
    //   onError: (err) => {
    //     console.log(err);
    //     // setFormErrors(transformErrors(err));
    //   },
    //   onSuccess: () => location.reload(),
    //   only: ['errors', 'challenge'],
    // });
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <h1 className="text-white text-xl font-semibold">Select Winner</h1>
        <RadioGroup
          value={data.winner}
          onChange={(value: any) => setData('winner', value)}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-4">
            {options.map((option) => (
              <RadioGroup.Option
                key={option.username}
                value={option.id}
                className={({ active }) =>
                  classNames(
                    active
                      ? 'border-blue-600 ring-2 ring-blue-600'
                      : 'border-gray-300',
                    'relative block cursor-pointer rounded-lg border bg-dark px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between'
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <RadioGroup.Label
                      as="span"
                      className="font-medium text-white"
                    >
                      {option.gamer_tag}
                    </RadioGroup.Label>
                    <RadioGroup.Description as="span" className="text-gray-500">
                      <span className="block sm:inline text-xs">
                        @{option.username}
                      </span>
                    </RadioGroup.Description>
                    <span
                      className={classNames(
                        active ? 'border' : 'border-2',
                        checked ? 'border-blue-600' : 'border-transparent',
                        'pointer-events-none absolute -inset-px rounded-lg'
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>

        <div>
          <Button
            className="w-full"
            type="submit"
            color="blue"
            disabled={data.winner === ''}
          >
            Select Winner
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SelectChallengeWinnerPartial;
