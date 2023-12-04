import * as React from 'react';
import { FormEventHandler, FunctionComponent, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { BanknotesIcon, ClipboardIcon } from '@heroicons/react/24/solid';
import { useCopyToClipboard } from '@/Hooks/useCopyToClipboard';
import { formatUniqueCode } from '@/Utils/string';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager, WagerStatus } from '@/schema';
import { useForm, usePage } from '@inertiajs/react';
import Cookies from 'js-cookie';
import { TransformedErrors, transformErrors } from '@/Utils/form';

type Props = {
  challenge: Wager;
  user: UserProfile;
};
// review with tristian:
// - add paypal migration (winner_paypal_id)

const ShareChallengeCard = () => {
  return <></>;
};

const Show: FunctionComponent<Props> = ({ challenge, user }) => {
  // show unique if status: awaiting_response & if they created it
  // show "accept": awaiting_response & if they did not create it
  const getDescription = () => {
    if (
      challenge.status === WagerStatus.AWAITING_RESPONSE &&
      challenge.challenger_id == user.user
    ) {
      return 'Send the code below to challenge your opponent.';
    }

    if (
      challenge.status === WagerStatus.AWAITING_RESPONSE &&
      challenge.respondent_id == null
    ) {
      return 'Accept the challenge';
    }

    return '';
  };

  const [description] = useMemo(() => {
    let description = '';

    if (
      challenge.status === WagerStatus.AWAITING_RESPONSE &&
      user.user === challenge.challenger_id
    ) {
      description = 'Send the code below to challenge your opponent.';
    }

    if (
      challenge.status === WagerStatus.AWAITING_RESPONSE &&
      challenge.respondent_id === null
    ) {
      description = 'Accept this challenge';
    }

    if (challenge.status === WagerStatus.ACCEPTED) {
      description = 'Make a Payment';
    }

    return [description];
  }, [challenge]);
  return (
    <AuthenticatedLayout
      user={user}
      title="Challenge Detail"
      description={description}
    >
      <div className="container mx-auto py-5 px-4">
        <ChallengeDetail challenge={challenge} user={user} />
      </div>
    </AuthenticatedLayout>
  );
};

const ChallengeDetail: FunctionComponent<{
  challenge: Wager;
  user: UserProfile;
}> = ({ challenge, user }) => {
  const props = usePage().props;
  const [copied, setCopied] = useState(false);
  const [copiedValue, copy] = useCopyToClipboard();
  const handleCopy = async () => {
    await copy(location.host + '/challenge/' + challenge.unique_code);
  };
  // awaiting response & creator -> share link
  // awaiting response & not creator -> accept challenge
  // accepted & respondent or creator -> select winner
  // disputed -> "oops"
  // completed & is_winner -> winner screen
  // completed & challenge.payment_id === null -> add paypal screen
  if (
    challenge.status === WagerStatus.AWAITING_RESPONSE &&
    user.user === challenge.challenger_id
  ) {
    // show share link
    return (
      <Card className="max-w-xl text-center mx-auto">
        <h3 className="text-gray-500 font-medium text-sm">Challenge</h3>
        <h1 className="text-white text-2xl font-semibold">
          {challenge.game.game}
        </h1>
        <h1 className="text-gray-300 font-medium">
          {/*TODO: Add dayjs as dependency*/}
          {new Date(challenge.created_at).toLocaleDateString()}
        </h1>

        <div className="flex items-center justify-center">
          <div className="rounded w-full bg-dark flex items-center justify-between p-2 border border-gray-400">
            <h3 className="text-gray-500 uppercase">
              {formatUniqueCode(challenge.unique_code)}
            </h3>
            <button onClick={handleCopy}>
              <ClipboardIcon className="text-blue-500 h-6 w-6" />
            </button>
          </div>
        </div>
        {copiedValue && (
          <small className="mt-1 text-green-500 text-sm">
            Copied challenge code to clipboard.
          </small>
        )}

        <a href="#" className="text-gray-300 underline">
          Link to Discord
        </a>
      </Card>
    );
  }

  if (
    challenge.status === WagerStatus.AWAITING_RESPONSE &&
    challenge.respondent_id === null
  ) {
    const [formErrors, setFormErrors] = useState<TransformedErrors | null>(
      null
    );
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
        only: ['errors', 'challenge'],
      });
      console.log('to accept');
    };

    return (
      <Card className="max-w-xl text-center mx-auto">
        <div className="mt-6">
          <dl className="space-y">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-white">
                Challenger
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                @{challenge.challenger_gamer_tag}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-white">Game</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
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
                {challenge.notes}
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
              color={
                formErrors?.errors.respondent_gamer_tag ? 'failure' : 'gray'
              }
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
  }

  if (challenge.status === WagerStatus.ACCEPTED) {
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
            Pay {currencyFormatter.format(Number(challenge.amount))}, Win{' '}
            {currencyFormatter.format(Number(challenge.amount * 1.8))}
          </h1>
        </div>

        <Button className="w-full mt-5" color="blue">
          Pay Now
        </Button>
      </Card>
    );
  }

  if (challenge.status === WagerStatus.DISPUTED) {
    return <h1>show disputed</h1>;
  }

  if (challenge.status === WagerStatus.COMPLETED) {
    return <h1>completed</h1>;
  }

  return <></>;
};

export default Show;
