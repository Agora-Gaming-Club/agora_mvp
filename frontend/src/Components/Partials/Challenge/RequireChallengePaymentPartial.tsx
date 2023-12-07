import * as React from 'react';
import {
  FormEventHandler,
  FunctionComponent,
  SyntheticEvent,
  useState,
} from 'react';
import { Button, Card, Modal, TextInput } from 'flowbite-react';
import { BanknotesIcon } from '@heroicons/react/24/solid';
import { currencyFormatter } from '@/Utils/money';
import { UserProfile, Wager } from '@/schema';
import { useAcceptJs } from 'react-acceptjs';
import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import { useForm } from '@inertiajs/react';

const authData = {
  apiLoginID: '5UQt6rAa8T',
  clientKey: '4tNj6v78h5c8xtNxKYCG25r79VE5Qa9963n7HTvqDFTxzNf47eVce4k26u9Htjcp',
};

type BasicCardInfo = {
  cardNumber: string;
  cardCode: string;
  month: string;
  year: string;
};

type Props = {
  challenge: Wager;
  user: UserProfile;
};

const RequireChallengePaymentPartial: FunctionComponent<Props> = ({
  challenge,
  user,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const { dispatchData, loading, error } = useAcceptJs({ authData });
  const [creditCard, setCreditCard] = useState({
    cardNumber: '',
    expYear: '',
    cvc: '',
  });
  const { data, setData, post } = useForm({
    data_value: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
    wrapperProps,
  } = usePaymentInputs();

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    if (meta.isTouched && meta.error) {
      return;
    }

    const exp = creditCard.expYear.split('/');
    const authorizeNetCard: BasicCardInfo = {
      cardNumber: creditCard.cardNumber.replaceAll(' ', ''),
      month: exp[0].replaceAll(' ', ''),
      year: exp[1].replaceAll(' ', ''),
      cardCode: creditCard.cvc.replaceAll(' ', ''),
    };

    // Dispatch CC data to Authorize.net and receive payment nonce for use on your server
    try {
      const { messages, opaqueData } = await dispatchData({
        cardData: authorizeNetCard,
      });

      data.data_value = opaqueData.dataValue;
      post(`/challenge/${challenge.unique_code}`, {
        onError: (err) => {
          console.log(err);
          // setFormErrors(transformErrors(err));
        },
        onSuccess: () => location.reload(),
        only: ['errors', 'challenge'],
      });
    } catch (e: any) {
      setErrorMessage(e.messages.message[0].text);
    }
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
          Pay {currencyFormatter.format(Number(challenge.amount))}, Win{' '}
          {currencyFormatter.format(Number(challenge.amount * 1.8))}
        </h1>
      </div>

      <Button
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
            <div className="flex justify-center">
              <PaymentInputsWrapper {...wrapperProps}>
                <svg
                  {...getCardImageProps({
                    // @ts-ignore
                    images,
                  })}
                />
                <input
                  {...getCardNumberProps({
                    onChange: (event: any) =>
                      setCreditCard({
                        ...creditCard,
                        cardNumber: event.target.value,
                      }),
                  })}
                />
                <input
                  {...getExpiryDateProps({
                    onChange: (event: any) =>
                      setCreditCard({
                        ...creditCard,
                        expYear: event.target.value,
                      }),
                  })}
                />
                <input
                  {...getCVCProps({
                    onChange: (event: any) =>
                      setCreditCard({
                        ...creditCard,
                        cvc: event.target.value,
                      }),
                  })}
                />
              </PaymentInputsWrapper>
            </div>
            {errorMessage && (
              <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="blue"
              type="submit"
              isProcessing={loading}
              disabled={loading}
            >
              Pay {currencyFormatter.format(challenge.amount)}
            </Button>
            <Button
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

export default RequireChallengePaymentPartial;
