import React, { useRef, useEffect } from 'react';
import axios from 'axios';

declare global {
  class PAYNOTE {
    constructor(options: {
      publicKey: string;
      sandbox?: boolean;
      displayMethod?: string;
      paymentToken: string;
      widgetContainerSelector?: string;
      style: {
        buttonClass: string;
      };
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

export type PaynoteButtonType = {
  onSuccess?: () => void;
  onError?: () => void;
  payload: {
    checkout: {
      totalValue: number;
      currency: string;
      description?: string;
      items?: { title: string; price: number }[];
      customerEmail?: string;
      customerFirstName?: string;
      customerLastName?: string;
    };
  };
  challengeId: string;
};

export const PaynoteButton = ({
  onSuccess,
  onError,
  payload,
  challengeId,
}: PaynoteButtonType) => {
  const paynoteRef = useRef<any>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  const objRequestIframe = {
    publicKey: 'pk_test_01J0TXFJPMGF0WFHHSD2GVBB29', // Replace with actual public key
    sandbox: true,
    displayMethod: 'iframe',
    paymentToken: `pay_tok_SPECIMEN-${Math.random()}`,
    widgetContainerSelector: 'paynote-widget-container',
    style: {
      buttonLabel: 'Pay Now',
      buttonStyles: '',
      buttonClass:
        'paynote-btn group flex items-center justify-center z-0 min-h-1  px-4 py-2 text-center font-medium focus:z-10 focus:outline-none text-white bg-blue-700 border border-transparent enabled:hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg focus:ring-2 w-full mt-5',
    },
    ...payload,
    onSuccess: async (data: any) => {
      console.log('Payment Successful:', data);

      try {
        // Call the challenge_ante endpoint
        await axios.post(`/challenge/ante/${challengeId}`, { data_value: data });

        // Call the challenge_winner endpoint
        await axios.post(`/challenge/winner/${challengeId}`);

        onSuccess && onSuccess();
      } catch (error) {
        console.error('Error in payment process:', error);
        onError && onError();
      }
    },
    onError: (error: any) => {
      console.error('Payment Error:', error);
      onError && onError();
    },
  };

  useEffect(() => {
    if (renderRef.current) {
      paynoteRef.current = new PAYNOTE(objRequestIframe);
      paynoteRef.current.render();
    }
  }, [renderRef.current]);

  return <div ref={renderRef} className="paynote-widget-container" />;
};
