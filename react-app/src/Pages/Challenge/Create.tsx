import * as React from 'react';
import { FormEventHandler, FunctionComponent, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import {
  Alert,
  Button,
  Label,
  Select,
  Textarea,
  TextInput,
} from 'flowbite-react';
import { amounts } from '@/Data/amounts';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import Cookies from 'js-cookie';
import { Game, UserProfile } from '@/schema';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

type Props = {
  platforms: any;
  games: Game[];
  user: UserProfile;
};

const Create: FunctionComponent<Props> = ({ platforms, games, user }) => {
  console.log(games);
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post, processing } = useForm({
    amount: '',
    platform: '',
    game: '',
    challenger_gamer_tag: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post('/challenge', {
      onSuccess: (data) => {
        // window.location.href = data.props.url as unknown as string; // work around
      },
      onError: (err) => {
        console.log(err);
        setFormErrors(transformErrors(err));
      },
      only: ['errors'],
    });
  };

  return (
    <AuthenticatedLayout
      user={user}
      title="Create a Challenge"
      description="Enter the details of your challenge below. We’ll generate a unique
              code to share."
    >
      <div className="container mx-auto py-5 px-4">
        <form onSubmit={submit} className="grid grid-cols-1  gap-8">
          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="amount" value="Amount" />
            </div>
            <Select
              id="amount"
              value={data.amount}
              onChange={(e) => setData('amount', e.target.value)}
              required
            >
              <option disabled value="" selected>
                Select Wager Amount
              </option>
              {amounts.map((amount) => (
                <option key={amount.value} value={amount.value}>
                  {amount.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="game" value="Game" />
            </div>
            <Select
              id="game"
              value={data.game}
              onChange={(e) => setData('game', e.target.value)}
              required
            >
              <option disabled value="" selected>
                Select a Game
              </option>
              {games.map((game) => (
                <option key={game.game} value={game.slug}>
                  {game.game}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="gamerTag" value="Gamer Tag" />
            </div>
            <TextInput
              id="gamerTag"
              type="text"
              placeholder="Enter your Gamer Tag"
              value={data.challenger_gamer_tag}
              onChange={(e) => setData('challenger_gamer_tag', e.target.value)}
              required
            />
          </div>
          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="platform" value="Platform" />
            </div>
            <Select
              id="platform"
              required
              value={data.platform}
              onChange={(e) => setData('platform', e.target.value)}
            >
              <option disabled value="" selected>
                Select a Platform
              </option>
              {platforms.map((platform: any) => (
                <option key={platform[0]} value={platform[0]}>
                  {platform[1]}
                </option>
              ))}
            </Select>
          </div>

          {data.game && games.length > 1 ? (
            <Alert color="info">
              <span className="font-medium">Game Terms!</span>
              {games.find((g) => g.slug == data.game)?.terms}
            </Alert>
          ) : null}

          <Button color="blue" type="submit">
            Create
          </Button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default Create;
