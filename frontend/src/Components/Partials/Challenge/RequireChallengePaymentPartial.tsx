import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button, Card, Modal } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager } from '@/schema';

declare global {
  interface Window {
    SeamlessChex: {
      Paynote: new (options: {
        publicKey: string;
        sandbox?: boolean;
        displayMethod?: 'iframe' | 'lightbox';
        paymentToken: string;
        widgetContainerSelector?: string;
        checkout: {
          totalValue: number;
          currency: string;
          description?: string;
          items?: { title: string; price: number }[];
          customerEmail?: string;
          customerFirstName?: string;
          customerLastName?: string;
        };
        onSuccess?: (data: any) => void;
        onError?: (error: any) => void;
      }) => any; // You might want to replace 'any' with a more specific type if possible
    };
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

  useEffect(() => {
    // Check if the script is already loaded
    if (typeof window.SeamlessChex === 'undefined') {
      const script = document.createElement('script');
      script.src =
        'https://developers.seamlesschex.com/docs/checkoutjs/sdk-min.js';
      script.async = true;

      document.head.appendChild(script);

      script.onload = () => {
        if (openModal) {
          const objRequestIframe = {
            publicKey: 'pk_test_01HRX9QGX6Q2N8E5Z12D07X87', // Replace with your actual public key
            sandbox: true, // Set to false for production
            displayMethod: 'iframe',
            paymentToken: `pay_tok_SPECIMEN-${Math.random()}`, // Unique token (replace in production)
            widgetContainerSelector: '#paynote-widget-container',
            checkout: {
              totalValue: challenge.amount, // Use challenge amount
              currency: 'USD', // Adjust currency as needed
              description: 'Wager Payment',
              items: [{ title: 'Wager', price: challenge.amount }],
              // Customer information (optional, but recommended)
              customerEmail: user.email,
              customerFirstName: user.first_name,
              customerLastName: user.last_name,
            },
            onSuccess: (data) => {
              console.log('Payment Successful:', data);
              setOpenModal(false); // Close the modal
              // Notify your backend of successful payment here
            },
            onError: (error) => {
              console.error('Payment Error:', error);
              // Handle the error (e.g., show error message to the user)
            },
          };

          new SeamlessChex.Paynote(objRequestIframe).render();
        }
      };

      script.onerror = () => {
        console.error('Error loading SeamlessChex script');
        // Handle the error appropriately
      };
    } else {
      // If script is already loaded, initialize Paynote if the modal is open
      if (openModal) {
        const objRequestIframe = {
          publicKey: 'pk_test_01HRX9QGX6Q2N8E5Z12D07X87', // Replace with your actual public key
          sandbox: true, // Set to false for production
          displayMethod: 'iframe',
          paymentToken: `pay_tok_SPECIMEN-${Math.random()}`, // Unique token (replace in production)
          widgetContainerSelector: '#paynote-widget-container',
          checkout: {
            totalValue: challenge.amount, // Use challenge amount
            currency: 'USD', // Adjust currency as needed
            description: 'Wager Payment',
            items: [{ title: 'Wager', price: challenge.amount }],
            // Customer information (optional, but recommended)
            customerEmail: user.email,
            customerFirstName: user.first_name,
            customerLastName: user.last_name,
          },
          onSuccess: (data) => {
            console.log('Payment Successful:', data);
            setOpenModal(false); // Close the modal
            // Notify your backend of successful payment here
          },
          onError: (error) => {
            console.error('Payment Error:', error);
            // Handle the error (e.g., show error message to the user)
          },
        };

        new SeamlessChex.Paynote(objRequestIframe).render();
      }
    }

    // Clean up (remove the script on component unmount)
    return () => {
      const seamlessScript = document.querySelector(
        'script[src="https://developers.seamlesschex.com/docs/checkoutjs/sdk-min.js"]'
      );
      if (seamlessScript) {
        document.head.removeChild(seamlessScript);
      }
    };
  }, [openModal, challenge.amount]);

  const handlePayNow = () => {
    setOpenModal(true);
  };

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
          <div id="paynote-widget-container"></div>{' '}
          {/* Container for the iframe */}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default RequireChallengePaymentPartial;
