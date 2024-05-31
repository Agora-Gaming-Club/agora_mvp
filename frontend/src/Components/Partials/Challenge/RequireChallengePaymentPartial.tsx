import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button, Card, Modal } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager } from '@/schema';

declare global {
  class PAYNOTE {
    constructor(options: {
      publicKey: string;
      sandbox?: boolean;
      displayMethod?: string;
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
    });
    render(): void;
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
  const paynoteRef = useRef<any>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  const objRequestIframe = {
    publicKey: 'pk_test_01HRX9QGX6Q2N8E5Z12D07X87', // Replace with actual public key
    sandbox: true,
    displayMethod: 'iframe',
    paymentToken: `pay_tok_SPECIMEN-${Math.random()}`,
    widgetContainerSelector: 'paynote-widget-container',
    checkout: {
      totalValue: challenge.amount,
      currency: 'USD',
      description: 'Wager Payment',
      items: [{ title: 'Wager', price: challenge.amount }],
      customerEmail: user.email,
      customerFirstName: user.first_name,
      customerLastName: user.last_name,
    },
    onSuccess: (data: any) => {
      console.log('Payment Successful:', data);
      setOpenModal(false);
    },
    onError: (error: any) => {
      console.error('Payment Error:', error);
    },
  };

  useEffect(() => {
    if (renderRef.current) {
      console.log('Initializing Paynote');
      try {
        paynoteRef.current = new PAYNOTE(objRequestIframe);
        paynoteRef.current.render();
      } catch (error) {
        console.log('Paynote Init Error', error);
      }
    }
  }, [openModal, renderRef.current]);

  const handlePayNow = () => {
    setOpenModal(true);
  };

  return (
    <Card className='max-w-xl text-center mx-auto'>
      <h3 className='text-white font-medium text-sm'>Stake Your Claim</h3>
      <p className='text-gray-400 text-xs'>
        One last step before you get started - you both need to make the wager
        payment agreed to for the challenge. The winner will receive the below
        payout after you play!
      </p>

      <div className='bg-dark rounded-full p-2 text-lg text-white flex items-center justify-center'>
        <span className='bg-green-400 rounded-full p-1 flex items-center justify-center mr-2'>
          <BanknotesIcon className='h-5 w-5' />
        </span>
        <h1>
          {currencyFormatter.format(Number(challenge.amount))} To Win{' '}
          {currencyFormatter.format(Number(challenge.amount * 1.8))}
        </h1>
      </div>

      {user.user === challenge.challenger_id ? (
        <p className='text-gray-400 text-xs mt-2'>
          You challenged {challenge.challenger_gamer_tag} to this wager.
          Awaiting their payment.
        </p>
      ) : (
        <p className='text-gray-400 text-xs mt-2'>
          {challenge.challenger_gamer_tag} challenged you to this wager. Pay{' '}
          {currencyFormatter.format(challenge.amount)} to accept.
        </p>
      )}

      <Button
        id='payNow'
        className='w-full mt-5'
        color='blue'
        onClick={handlePayNow}
      >
        Pay Now
      </Button>

      <div id='paynote-widget-container'></div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Payment</Modal.Header>
        <Modal.Body>
          <div ref={renderRef} className='paynote-widget-container'></div>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default RequireChallengePaymentPartial;
