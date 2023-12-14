import * as React from 'react';
import {FunctionComponent, useMemo} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {GameChoice, UserProfile, Wager, WagerStatus} from '@/schema';
import AcceptChallengePartial from '@/Components/Partials/Challenge/AcceptChallengePartial';
// @ts-ignore
import RequireChallengePaymentPartial from '@/Components/Partials/Challenge/RequireChallengePaymentPartial';
// @ts-ignore
import ShareChallengePartial from '@/Components/Partials/Challenge/ShareChallengePartial';
// @ts-ignore
import SelectChallengeWinnerPartial from '@/Components/Partials/Challenge/SelectChallengeWinnerPartial';
import ChallengeDescription from '@/Components/ChallengeDescription';
import {Alert, Button, Card} from 'flowbite-react';
import {InformationCircleIcon} from '@heroicons/react/24/outline';
// @ts-ignore
import PaypalChallengePartial from '@/Components/Partials/Challenge/PaypalChallengePartial';
// @ts-ignore
import WonChallengePartial from '@/Components/Partials/Challenge/WonChallengePartial';
import LostChallengePartial from '@/Components/Partials/Challenge/LostChallengePartial';
import {Link, usePage} from '@inertiajs/react';

type Props = {
  challenge: Wager;
  user?: UserProfile;
  choices: GameChoice[];
};

const Show: FunctionComponent<Props> = ({challenge, user}) => {
  const [description] = useMemo(() => {
    let description = '';

    if (!user) {
      return [description];
    }

    if (
      challenge.status === WagerStatus.AWAITING_RESPONSE &&
      user.user === challenge.challenger_id
    ) {
      description = 'Send the code below to challenge your opponent.';
      return [description];
    }

    if (
      challenge.status === WagerStatus.AWAITING_RESPONSE &&
      challenge.respondent_id === null
    ) {
      description = 'Accept this challenge by adding your gamer tag.';
      return [description];
    }

    if (challenge.status === WagerStatus.ACCEPTED) {
      description = 'Click the pay now button to proceed with this challenge.';
      return [description];
    }

    if (challenge.status === WagerStatus.IN_PROGRESS) {
       description = 'Play the game and select an outcome after the challenge has been completed.';
      return [description];
    }

    if (challenge.status === WagerStatus.DISPUTED) {
      description = 'This challenge has been disputed.';
      return [description];
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
          <ChallengeDetail challenge={challenge} user={user}/>
        ) : (
          <Card className="max-w-xl text-center mx-auto">
            <ChallengeDescription challenge={challenge}/>
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
}> = ({challenge, user}) => {
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
        return <ShareChallengePartial challenge={challenge} user={user}/>;
      }
      if (awaitingResponseAndNotChallenger()) {
        return <AcceptChallengePartial challenge={challenge} user={user}/>;
      }
      break;
    case WagerStatus.ACCEPTED:
      if (acceptedAndChallengerNotPaid() || acceptedAndRespondentNotPaid()) {
        const {authorize_login_id, authorize_public_key}: any = usePage().props
        const authorizeAuthData = {
          apiLoginID: authorize_login_id,
          clientKey: authorize_public_key
        }
        return (
          <RequireChallengePaymentPartial challenge={challenge} user={user} authData={authorizeAuthData}/>
        );
      }
      if (acceptedAndChallengerPaid() || acceptedAndRespondentPaid()) {
        return (
          <Card className="max-w-xl text-center mx-auto">
            {/*@ts-ignore*/}
            <Alert className='text-center' color="warning" icon={InformationCircleIcon}>
              We are now waiting for the other player's payment.
            </Alert>
            <ChallengeDescription challenge={challenge}/>
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
            <Alert
              className="text-xl font-semibold text-center"
              color="warning"
              // @ts-ignore
              icon={InformationCircleIcon}
            >
              We are now waiting for the respondent's vote.
            </Alert>
            <ChallengeDescription challenge={challenge}/>
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
            <Alert
              className="text-xl font-semibold text-center"
              color="warning"
              // @ts-ignore
              icon={InformationCircleIcon}
            >
              We are now waiting for the challenger's vote.
            </Alert>
            <ChallengeDescription challenge={challenge}/>
          </Card>
        );
      }

      return <SelectChallengeWinnerPartial challenge={challenge} user={user}/>;
    case WagerStatus.DISPUTED:
      return (
        <Card className="max-w-xl text-center mx-auto">
          <Alert color="failure" className="text-lg font-semibold text-center">
            Oops! Looks like you both reported different outcomes.
          </Alert>

          <p className="text-gray-400 text-center text-sm tracking-tight">
            Looks like you both had different answers for the outcome. We’ve
            forwarded the details of this challenge to the Agora team who will
            be following up with you via email to resolve the dispute. Note, the email will come from disputes@agoragaming.gg.
          </p>

          <p className="text-gray-400 text-center text-sm tracking-tight mt-1">
            In the meantime - please capture any screenshots, photos, or
            evidence needed to prove the outcome of the challenge.
          </p>
        </Card>
      );
    case WagerStatus.COMPLETED:
      if (challenge.winner_id !== user.user) {
        return <LostChallengePartial challenge={challenge} user={user}/>;
      }

      if (challenge.winner_id == user.user && !challenge.winner_paypal) {
        return <PaypalChallengePartial challenge={challenge} user={user}/>;
      }

      return <WonChallengePartial challenge={challenge} user={user}/>;
    case WagerStatus.EXPIRED:

      return (
        <Card className="max-w-xl text-center mx-auto">
          <Alert color="failure" className="text-lg font-semibold text-center">
            Oops! Looks no one accepted your challenge.
          </Alert>

          <p className="text-gray-400 text-center text-sm tracking-tight">
            Want to browse through existing active challenges? Head over to our{' '}
            <a href="https://https://discord.com/channels/1173680090371068006" target="_blank" className="underline">
              Agora Discord channel
            </a>{' '}
            to find a challenge that you can take on!
          </p>
          <div className="flex items-center space-x-4">
            <Button
              className="w-full"
              color="blue"
              as={Link as any}
              href={`/challenge`}
            >
              Create New Challenge
            </Button>
          </div>
        </Card>
      )
    default:
      return <></>;
  }
};

export default Show;
