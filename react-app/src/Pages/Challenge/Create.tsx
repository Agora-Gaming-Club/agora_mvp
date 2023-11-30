import { FormEventHandler, FunctionComponent, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Select,
  Textarea,
} from 'flowbite-react';
import { amounts } from '@/Data/amounts';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import Cookies from 'js-cookie';

type Props = {
  platforms: any;
  games: any;
  user: UserProfile;
};

const Create: FunctionComponent<Props> = ({ platforms, games, user }) => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post, processing } = useForm({
    notes: '',
    amount: '',
    platform: '',
    game: '',
    gamer_tag: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post('/challenge', {
      onSuccess: (data) => {
        // window.location.href = data.props.url as unknown as string; // work around
      },
      onError: (err) => {
        setFormErrors(transformErrors(err));
      },
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
              {games.map((game: any) => (
                <option key={game[0]} value={game[0]}>
                  {game[1]}
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
              placeholder="Enter Gamer Tag for this game"
              value={data.gamer_tag}
              onChange={(e) => setData('gamer_tag', e.target.value)}
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

          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="notes" value="Notes" />
            </div>
            <Textarea
              id="notes"
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
              placeholder="Any details on game mode or notes that you’d like your opponent to know. "
              rows={3}
            />
          </div>

          <Button color="blue" type="submit">
            Create
          </Button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default Create;
