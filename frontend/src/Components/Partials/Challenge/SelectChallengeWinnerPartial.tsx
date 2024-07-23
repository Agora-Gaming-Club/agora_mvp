import * as React from 'react';
import { FormEventHandler, FunctionComponent, useState } from 'react';
import { Button, Card } from 'flowbite-react';
import { UserProfile, Wager } from '@/schema';
import { classNames } from '@/Utils/styles';
import { RadioGroup } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import ChallengeDescription from '@/Components/ChallengeDescription';

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

  const { data, setData } = useForm({
    winner: '',
  });

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    console.log("Form data:", data);
    console.log("Challenge data:", challenge);

    if (challenge && challenge.unique_code) {
      try {
        const response = await axios.post(`/challenge/${challenge.unique_code}`, {
          winner: data.winner,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Post response:", response.data);
        // Reload the page if the post request is successful
        if (response.data) {
          location.reload();
        }
      } catch (error) {
        console.error("Post error:", error);
      }
    } else {
      console.error('Challenge or unique_code is undefined');
    }
  };

  return (
    <Card className="max-w-xl text-center mx-auto p-1 sm:p-5">
      <ChallengeDescription challenge={challenge} />

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
                      ? 'border-green-600 bg-green-500 ring-2 ring-green-600'
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
                    <RadioGroup.Description as="span" className="text-gray-300">
                      <span className="block sm:inline text-xs">
                        @{option.username}
                      </span>
                    </RadioGroup.Description>
                    <span
                      className={classNames(
                        active ? 'border' : 'border-2',
                        checked ? 'border-green-600' : 'border-transparent',
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
            id="selectWinner"
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
