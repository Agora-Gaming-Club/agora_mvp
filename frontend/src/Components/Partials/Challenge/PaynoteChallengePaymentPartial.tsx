import React, { FC, useState, useEffect } from 'react';
import { Button, Card, Modal } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager } from '@/schema';
import { Checkout } from 'checkout.js'; // Import Checkout.js

type Props = {
  challenge: Wager;
  user: UserProfile;
  authData: {
    apiLoginID: string;
    clientKey: string;
  };
};

const PaynoteChallengePaymentPartial: FC<Props> = ({
  challenge,
  user,
  authData,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [paynoteCheckout, setPaynoteCheckout] = useState<Checkout | null>(null);

  useEffect(() => {
    const initializeCheckout = async () => {
      const checkoutInstance = new Checkout('YOUR_PAYNOTE_PUBLIC_KEY');
      setPaynoteCheckout(checkoutInstance);
    };

    initializeCheckout();
  }, []);

  const handlePayment = async () => {
    if (!paynoteCheckout) {
      console.error('Checkout instance not initialized');
      return;
    }

    const paymentData = {
      publicKey: 'YOUR_PAYNOTE_PUBLIC_KEY', // Redundant for clarity
      paymentToken: 'your_custom_payment_token', // Replace with dynamic value
      totalValue: challenge.amount,
      currency: 'USD',
      customerEmail: user.email,
      customerFirstName: user.first_name,
      customerLastName: user.last_name,
      // Add other optional fields as needed (description, items, billing_cycle, etc.)
    };

    try {
      const session = await paynoteCheckout.sessions.create(paymentData);
      // Redirect the user to the Paynote payment session URL
      window.location.href = session.url;
    } catch (error) {
      console.error('Payment error:', error);
      // Handle payment errors here (display error message to user)
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handlePayment();
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

      <Button
        id="payNow"
        className="w-full mt-5"
        color="blue"
        onClick={() => setOpenModal(true)}
      >
        Pay Now
      </Button>

      <Modal size="sm" show={openModal} onClose={() => setOpenModal(false)}>
        <form onSubmit={handleSubmit}>
          <Modal.Header>Make Payment</Modal.Header>
          <Modal.Body>
            <p>
              This challenge uses Paynote for secure bank transfers. You will be
              redirected to Paynote to complete your payment.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="blue" type="submit">
              Pay {currencyFormatter.format(challenge.amount)}
            </Button>
            <Button
              id="cancelPayment"
              color="failure"
              onClick={() => setOpenModal(false)}
              type="button"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </Card>
  );
};

export default PaynoteChallengePaymentPartial;
