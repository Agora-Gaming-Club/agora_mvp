import * as React from 'react';
import { FunctionComponent, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCopyToClipboard } from '@/Hooks/useCopyToClipboard';
import { UserProfile, Wager, WagerStatus } from '@/schema';
import { Link, usePage } from '@inertiajs/react';
import AcceptChallengePartial from '@/Components/Partials/Challenge/AcceptChallengePartial';
// @ts-ignore
import RequireChallengePaymentPartial from '@/Components/Partials/Challenge/RequireChallengePaymentPartial';
// @ts-ignore
import ShareChallengePartial from '@/Components/Partials/Challenge/ShareChallengePartial';
import { HostedForm } from 'react-acceptjs';
import { AcceptHosted } from 'react-acceptjs';
// @ts-ignore
import SelectChallengeWinnerPartial from '@/Components/Partials/Challenge/SelectChallengeWinnerPartial';
import ChallengeDescription from '@/Components/ChallengeDescription';
import { Alert, Button, Card } from 'flowbite-react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

type Props = {
  challenge: Wager;
  user?: UserProfile;
};

const Show: FunctionComponent<Props> = ({ challenge, user }) => {
  console.log(user);
  const [description] = useMemo(() => {
    let description = '';

    if (!user) {
      return [''];
    }

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
        {user ? (
          <ChallengeDetail challenge={challenge} user={user} />
        ) : (
          <Card className="max-w-xl text-center mx-auto">
            <ChallengeDescription challenge={challenge} />
            <h3 className="text-white">
              Signup or Register to Accept Challenge
            </h3>
            <div className="flex items-center space-x-4">
              <Button
                className="w-full"
                color="blue"
                // @ts-ignore
                as="a"
                href={`/accounts/register?redirect=/challenge/${challenge.unique_code}`}
              >
                Register
              </Button>
              <Button
                className="w-full"
                color="blue"
                // @ts-ignore
                as="a"
                href={`/accounts/login?redirect=/challenge/${challenge.unique_code}`}
                outline
              >
                Login
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

const ChallengeDetail: FunctionComponent<{
  challenge: Wager;
  user: UserProfile;
}> = ({ challenge, user }) => {
  const isChallenger = user.user === challenge.challenger_id;
  const isRespondent = user.user === challenge.respondent_id;
  const isAwaitingResponse = challenge.status === WagerStatus.AWAITING_RESPONSE;
  const isAccepted = challenge.status === WagerStatus.ACCEPTED;

  const awaitingResponseAndChallenger = () =>
    isAwaitingResponse && isChallenger;
  const awaitingResponseAndNotChallenger = () =>
    isAwaitingResponse && challenge.respondent_id === null;
  const acceptedAndChallengerNotPaid = () =>
    isAccepted && !challenge.challenger_paid && isChallenger;
  const acceptedAndRespondentNotPaid = () =>
    isAccepted && !challenge.respondent_paid && isRespondent;
  const acceptedAndChallengerPaid = () =>
    isAccepted && challenge.challenger_paid && isChallenger;
  const acceptedAndRespondentPaid = () =>
    isAccepted && challenge.respondent_paid && isRespondent;
  const challengerVotedForWinner = () => challenge.challenger_vote;
  const respondentVotedForWinner = () => challenge.respondent_vote;

  switch (challenge.status) {
    case WagerStatus.AWAITING_RESPONSE:
      if (awaitingResponseAndChallenger()) {
        return <ShareChallengePartial challenge={challenge} user={user} />;
      }
      if (awaitingResponseAndNotChallenger()) {
        return <AcceptChallengePartial challenge={challenge} user={user} />;
      }
      break;
    case WagerStatus.ACCEPTED:
      if (acceptedAndChallengerNotPaid() || acceptedAndRespondentNotPaid()) {
        return (
          <RequireChallengePaymentPartial challenge={challenge} user={user} />
        );
      }
      if (acceptedAndChallengerPaid() || acceptedAndRespondentPaid()) {
        return (
          <Card className="max-w-xl text-center mx-auto">
            {/*@ts-ignore*/}
            <Alert color="warning" icon={InformationCircleIcon}>
              We are now waiting for the other player's payment.
            </Alert>
            <ChallengeDescription challenge={challenge} />
          </Card>
        );
      }
      break;
    case WagerStatus.IN_PROGRESS:
      if (
        challenge.challenger_id == user.user &&
        challengerVotedForWinner() &&
        !respondentVotedForWinner()
      ) {
        return (
          <Card className="max-w-xl text-center mx-auto">
            {/*@ts-ignore*/}
            <Alert color="warning" icon={InformationCircleIcon}>
              We are now waiting for the respondent's vote.
            </Alert>
            <ChallengeDescription challenge={challenge} />
          </Card>
        );
      }

      if (
        challenge.respondent_id == user.user &&
        !challengerVotedForWinner() &&
        respondentVotedForWinner()
      ) {
        return (
          <Card className="max-w-xl text-center mx-auto">
            {/*@ts-ignore*/}
            <Alert color="warning" icon={InformationCircleIcon}>
              We are now waiting for the challenger's vote.
            </Alert>
            <ChallengeDescription challenge={challenge} />
          </Card>
        );
      }

      return <SelectChallengeWinnerPartial challenge={challenge} user={user} />;
    case WagerStatus.DISPUTED:
      return <h1>show disputed</h1>;
    case WagerStatus.COMPLETED:
      return <h1>completed</h1>;
    default:
      return <></>;
  }
};

export default Show;
