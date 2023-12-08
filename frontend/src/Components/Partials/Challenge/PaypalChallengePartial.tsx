import * as React from 'react';
import { FormEventHandler, FunctionComponent, useState } from 'react';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import { useForm } from '@inertiajs/react';
import Cookies from 'js-cookie';
import { UserProfile, Wager } from '@/schema';
import { Button, Card, Label, TextInput } from 'flowbite-react';

type Props = {
  challenge: Wager;
  user: UserProfile;
};
const PaypalChallengePartial: FunctionComponent<Props> = ({ challenge }) => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post } = useForm({
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
    <Card className="max-w-xl text-center mx-auto p-1 sm:p-5">
      <h1 className="text-white text-xl font-semibold">
        Click below to receive your prize for winning the challenge (
        {challenge.challenger_gamer_tag} vs {challenge.respondent_gamer_tag})
      </h1>
      <p className="text-gray-400 text-sm">
        Payments will be issued via PayPal within 24 hours of submission.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="paypalEmail" value="PayPal ID" />

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
