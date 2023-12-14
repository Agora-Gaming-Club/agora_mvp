import * as React from 'react';
import {FormEventHandler, FunctionComponent, useState} from 'react';
import {TransformedErrors, transformErrors} from '@/Utils/form';
import {useForm} from '@inertiajs/react';
import Cookies from 'js-cookie';
import {UserProfile, Wager} from '@/schema';
import {Alert, Button, Card, Label, TextInput} from 'flowbite-react';

type Props = {
  challenge: Wager;
  user: UserProfile;
};
const PaypalChallengePartial: FunctionComponent<Props> = ({challenge}) => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const {data, setData, post} = useForm({
    paypal_email: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });
  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(`/challenge/${challenge.unique_code}`, {
      onError: (err) => {
        console.log(err);
        setFormErrors(transformErrors(err));
      },
      onSuccess: () => location.reload(),
      only: ['errors', 'challenge'],
    });
  };

  return (
    <Card className="max-w-xl text-center mx-auto">
      <Alert color="success" className="text-xl font-semibold text-center">
        Congratulations — you won this challenge! ({challenge.challenger_gamer_tag} vs{' '}
        {challenge.respondent_gamer_tag})
      </Alert>

      <p className="text-gray-400 text-sm">
        Submit your ID below to receive your prize for winning the challenge. Payments will be issued via PayPal within
        24 hours of submission. You will receive an SMS notification when your payment has been issued.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="paypalEmail" value="PayPal ID"/>

          <TextInput
            id="paypalEmail"
            value={data.paypal_email}
            onChange={(e) => setData('paypal_email', e.target.value)}
            type="email"
            className="mt-1 w-full"
            placeholder="Enter your Paypal Email Address"
            required
            color={formErrors?.errors.paypal_email ? 'failure' : 'gray'}
            helperText={formErrors?.errors.paypal_email ?? ''}
          />
        </div>

        <div>
          <Button className="w-full" type="submit" color="blue">
            Submit
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PaypalChallengePartial;
