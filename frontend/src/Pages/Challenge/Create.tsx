import * as React from 'react';
import { FormEventHandler, FunctionComponent, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { Alert, Button, Label, Select, TextInput } from 'flowbite-react';
import { amounts } from '@/Data/amounts';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import Cookies from 'js-cookie';
import {GameChoice, UserProfile} from '@/schema';

type Props = {
  user: UserProfile;
  choices: GameChoice[];
};


const Create: FunctionComponent<Props> = ({ user, choices }) => {
  const gameNames = Object.keys(choices);
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post, processing } = useForm({
    amount: '',
    platform: '',
    game: '',
    challenger_gamer_tag: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
    terms: '',
  });
  const [selectedGameName, setSelectedGameName] = useState<
    string | undefined
  >();

  const [selectedGameInfo] = useMemo(() => {
    let choice;

    if (selectedGameName) {
      // @ts-ignore
      choice = choices[selectedGameName] as GameInfo;
    }

    return [choice];
  }, [selectedGameName]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    if (selectedGameName) {
      data.game = selectedGameName;
    }

    if (selectedGameInfo && selectedGameInfo.terms.length > 0) {
      data.terms = selectedGameInfo.terms[0].term;
    }

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
              value={selectedGameName}
              onChange={(e) => setSelectedGameName(e.target.value)}
              required
            >
              <option disabled value={undefined} selected>
                Select Game Title
              </option>
              {gameNames.map((gameName) => (
                <option key={gameName}>{gameName}</option>
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
          {selectedGameInfo && (
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
                {selectedGameInfo.platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {selectedGameInfo ? (
            <Alert color="info">
              <span className="font-medium">Game Terms: </span>
              {selectedGameInfo.terms.length > 0 && (
                <span>
                  {selectedGameInfo.terms[0].term} <br />{' '}
                </span>
              )}
            </Alert>
          ) : null}

          <Button id="submitCreateChallenge" color="blue" type="submit">
            Create
          </Button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default Create;
