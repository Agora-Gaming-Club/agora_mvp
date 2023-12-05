import * as React from 'react';
import { FunctionComponent, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCopyToClipboard } from '@/Hooks/useCopyToClipboard';
import { UserProfile, Wager, WagerStatus } from '@/schema';
import { usePage } from '@inertiajs/react';
import AcceptChallengePartial from '@/Components/Partials/Challenge/AcceptChallengePartial';
import RequireChallengePaymentPartial from '@/Components/Partials/Challenge/RequireChallengePaymentPartial';
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
  const props = usePage().props;
  const [copied, setCopied] = useState(false);
  const [copiedValue, copy] = useCopyToClipboard();
  const handleCopy = async () => {
    await copy(location.host + '/challenge/' + challenge.unique_code);
  };
  // accepted & respondent or creator -> select winner
  // disputed -> "oops"
  // completed & is_winner -> winner screen
  // completed & challenge.payment_id === null -> add paypal screen
  if (
    challenge.status === WagerStatus.AWAITING_RESPONSE &&
    user.user === challenge.challenger_id
  ) {
    // awaiting response & creator -> share link
    return <ShareChallengePartial challenge={challenge} user={user} />;
  }

  if (
    challenge.status === WagerStatus.AWAITING_RESPONSE &&
    challenge.respondent_id === null
  ) {
    // awaiting response & not creator -> accept challenge
    return <AcceptChallengePartial challenge={challenge} user={user} />;
  }

  if (challenge.status === WagerStatus.ACCEPTED) {
    const authData = {
      apiLoginID: '5UQt6rAa8T',
      clientKey: '47xHPz97xFXz2A3t',
    };

    type BasicCardInfo = {
      cardNumber: string;
      cardCode: string;
      month: string;
      year: string;
    };
    const handleSubmit = (response: any) => {
      console.log('Received response:', response);
    };
    const formToken =
      'BiQ/NHbH+6PvrbidOG2Efnga52QAuR9ffiHYJqEt6Q3DUSX4limPklTRR+DLpQ02foTRVDsTqfCoRkQASkzE8iFoTHzecbQMP1hNqOX/UzUfISnTCBQwkN3awNXNRIGcKQwizvn+aoEqjy/PvYw9GIQsfjQeRzIeCFQ6/wmRLuktRIPQDbCOLiuzpG2YTNV7vkhHS4nbS1ARkjBuopynWrpZNS7oDQKn6ef+A2xRHIPnCtperLmEVpMltgmfSLxU09VITiLmDxr8GtYz0fl5Zcs49SrhU0Y4gRs1NNDHWmhB+rYUzXUGIvT8/XGkrkrQc0hBG0fqYUPbRH62joxXiW92k25MmnJ7YnsFf4bomH9VBG9EzZ0sQ/E6ipcpA5lHSvCLs2waAb+ydMfPILnfB8ceBTGqp+GiVM7BISeWITfuUNIV5AGUV2CWxIr1FOKDGTXXesuQECShNPRHyCECJUTESVeGxanSbG8qYE4EkDPC3ZFop3Hg44LgDDTRBTJTvMgACkWQT4LeQG1oLD07XCLfdUV4D3CbVlUAYZEBIMZrPTRvQeOWkeBlQCrofSadDj35SIEeKL0TN6wedFe8U+dmgOEb9zYVs5k5svKxGCVnNWo5/RmhXzUqa5FtjRipQMkF2d6W3lMo+gIwkV0D/lP+r2RpffCccRo8/CDspDWPitWqPrflBDafSD82hvlFhC/n5PV4CdMhdKT/c12u1KObG59SHA1hPMYTGEKxKpAuYpTtXiRT1HUtiZ4C9y1C4qYz3aqQbQ9LsPwb5E3tnA44qnsmIpncW7ilJ+8hMAPMytaMKjcouk08j+0sJ8fyFy5NgVqz4z2CD7cdTNrE8+5lEqLlxv+FOw5Azvqfv7M=.5UQt6rAa8T';
    return <RequireChallengePaymentPartial challenge={challenge} user={user} />;
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
