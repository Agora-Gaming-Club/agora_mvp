import * as React from 'react';
import { FunctionComponent, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCopyToClipboard } from '@/Hooks/useCopyToClipboard';
import { UserProfile, Wager, WagerStatus } from '@/schema';
import { usePage } from '@inertiajs/react';
import AcceptChallengePartial from '@/Components/Partials/Challenge/AcceptChallengePartial';
// @ts-ignore
import RequireChallengePaymentPartial from '@/Components/Partials/Challenge/RequireChallengePaymentPartial';
// @ts-ignore
import ShareChallengePartial from '@/Components/Partials/Challenge/ShareChallengePartial';
import { HostedForm } from 'react-acceptjs';
import { AcceptHosted } from 'react-acceptjs';

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
  console.log(challenge);

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
          <div>
            <h1 className="text-white">waiting on other person to pay</h1>
          </div>
        );
      }
      break;
    case WagerStatus.IN_PROGRESS:
      return <h1>select by username, value id</h1>;
    case WagerStatus.DISPUTED:
      return <h1>show disputed</h1>;
    case WagerStatus.COMPLETED:
      return <h1>completed</h1>;
    default:
      return <></>;
  }
};

export default Show;
