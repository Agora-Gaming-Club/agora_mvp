import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button, Card, Modal } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager } from '@/schema';

declare namespace SeamlessChex {
  class Paynote {
    constructor(options: {
      token: string;
      onSuccess: (data: any) => void;
      onError: (error: any) => void;
    });
    open(): void;
    close(): void;
  }
}

type Props = {
  challenge: Wager;
  user: UserProfile;
};

const RequireChallengePaymentPartial: React.FC<Props> = ({
  challenge,
  user,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [paynoteToken, setPaynoteToken] = useState<string | null>(null);
  const seamlessRef = useRef<SeamlessChex.Paynote | null>(null);

  const handlePayNow = async () => {
    try {
      const response = await fetch('/api/generate-paynote-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: challenge.amount,
          userId: user.user,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Paynote token');
      }

      const tokenData = await response.json();
      setPaynoteToken(tokenData.token);
      setOpenModal(true); // Open modal after receiving the token
    } catch (error) {
      console.error('Error during payment process:', error);
      // Handle the error appropriately (e.g., show error message to the user)
    }
  };

  useEffect(() => {
    if (openModal && paynoteToken && !seamlessRef.current) {
      const seamless = new SeamlessChex.Paynote({
        token: paynoteToken,
        onSuccess: (data) => {
          console.log('Payment Successful:', data);
          if (seamlessRef.current) {
            seamlessRef.current.close();
            setOpenModal(false); // Close the modal after successful payment
          }
          // Notify your backend of successful payment here
          console.log('Payment Successful (2):', data);
        },
        onError: (error) => {
          console.error('Payment Error:', error);
          // Handle the error (e.g., show error message to the user)
        },
      });

      seamlessRef.current = seamless;
      seamless.open();
    }
  }, [openModal, paynoteToken]); // Trigger effect when openModal or paynoteToken changes

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
          {currencyFormatter.format(Number(challenge.amount))} To Win{' '}
          {currencyFormatter.format(Number(challenge.amount * 1.8))}
        </h1>
      </div>

      {/* Existing logic for checking user role and displaying challenge details */}
      {user.user === challenge.challenger_id ? (
        <p className="text-gray-400 text-xs mt-2">
          You challenged {challenge.challenger_gamer_tag} to this wager.
          Awaiting their payment.
        </p>
      ) : (
        <p className="text-gray-400 text-xs mt-2">
          {challenge.challenger_gamer_tag} challenged you to this wager. Pay{' '}
          {currencyFormatter.format(challenge.amount)} to accept.
        </p>
      )}

      <Button
        id="payNow"
        className="w-full mt-5"
        color="blue"
        onClick={handlePayNow}
      >
        Pay Now
      </Button>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Payment</Modal.Header>
        <Modal.Body>
          {/* Modal content is empty, as Paynote will be loaded within useEffect */}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default RequireChallengePaymentPartial;
