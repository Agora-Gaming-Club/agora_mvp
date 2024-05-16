import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button, Card, Modal } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager } from '@/schema';

declare namespace SeamlessChex {
  class Paynote {
    constructor(options: {
      key: string;
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
  const seamlessRef = useRef<SeamlessChex.Paynote | null>(null);

  const handlePayNow = async () => {
    try {
      // Load the Paynote script (if not already loaded)
      if (!window.SeamlessChex) {
        const script = document.createElement('script');
        script.src = 'https://cdn.seamlesschex.com/paynote/v1/seamless.js';
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      // Initialize Paynote directly on the frontend
      const seamless = new SeamlessChex.Paynote({
        key: 'pk_01HW96B6NX3Q6TSXEJFX6JBAPR', // Your Paynote public key
        onSuccess: (data) => {
          console.log('Payment Successful:', data);
          if (seamlessRef.current) {
            seamlessRef.current.close();
            setOpenModal(false); // Close the modal after successful payment
          }
          // Notify your backend of successful payment here
        },
        onError: (error) => {
          console.error('Payment Error:', error);
          // Handle the error (e.g., show error message to the user)
        },
      });

      seamlessRef.current = seamless;
      setOpenModal(true); // Open the modal
    } catch (error) {
      console.error('Error during payment process:', error);
      // Handle the error appropriately (e.g., show error message to the user)
    }
  };

  useEffect(() => {
    // Ensure the Paynote script is loaded before calling `seamless.open()`
    if (openModal && seamlessRef.current) {
      seamlessRef.current.open();
    }
  }, [openModal]); // Only run when openModal changes

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
