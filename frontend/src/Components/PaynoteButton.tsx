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
        customerPhone?: string;
        customerFirstName?: string;
        customerLastName?: string;
        customerAgoraID?: string;
        customerUsername?: string;
      };
      authorizationOnly?: boolean;
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
      customerPhone?: string;
      customerFirstName?: string;
      customerLastName?: string;
      customerAgoraID?: string;
      customerUsername?: string;
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
    authorizationOnly: true, // Save bank details for future use
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
      console.log('Bank Details Saved:', data);
      console.log('Payload:', payload);

      try {
        // Call the create_customer endpoint
        const customerResponse = await axios.post(`/user`, {
          firstName: payload.checkout.customerFirstName,
          lastName: payload.checkout.customerLastName,
          email: payload.checkout.customerEmail,
          businessName: payload.checkout.customerUsername, // Add business name if available
          phone: payload.checkout.customerPhone, // Add phone number if available
        });
        const userId = customerResponse.data.user.user_id;
        console.log('Customer Created:', customerResponse.data);

        // Save the userId to your UserProfile
        await axios.post('/accounts/update_profile/', {
          agoraUserId: payload.checkout.customerAgoraID,
          paynoteUserId: userId,
        });
        console.log('User Profile Updated with Paynote User ID:', userId);

        // Call the create_funding_source endpoint
        const fundingResponse = await axios.post(`/on-demand/create_funding_source/`, {
          user_id: userId,
          routing: data.routing, // Replace with actual routing
          number: data.number, // Replace with actual account number
          type: data.type, // Replace with actual account type
          bank: data.rec_bname, // Replace with actual bank name
        });
        console.log('Funding Source Created:', fundingResponse.data);

        // Call the challenge_ante endpoint
        await axios.post(`/challenge/ante/${challengeId}`, { data_value: data });

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
