import React, { FormEventHandler, FunctionComponent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, TextInput } from 'flowbite-react';
import Cookies from 'js-cookie';

const ForgotPassword: FunctionComponent = () => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);

  const { data, setData, post, processing, wasSuccessful } = useForm({
    email: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post('/accounts/forgot_password', {
      onError: (err) => {
        console.log(err);
        setFormErrors(transformErrors(err));
      },
      onSuccess: () => {
        window.location.href = '/accounts/login'
      },
      only: ['errors'],
    });
  };
  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="mb-4 text-sm text-gray-300">
        Forgot your password? Input your email and we will email you a password
        reset link that will allow you to choose a new one.
      </div>

      {wasSuccessful && (
        <div className="mb-4 font-medium text-sm text-green-600">
          We have sent a password reset link to your email.
        </div>
      )}

      <form onSubmit={submit}>
        <TextInput
          id="email"
          type="email"
          name="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          color={formErrors?.errors?.email ? 'failure' : 'gray'}
          helperText={<span>{formErrors?.errors?.email ?? ''}</span>}
          placeholder="Enter Your Email"
        />

        <div className="flex items-center justify-end mt-4">
          <Button
            id="sendPasswordReset"
            type="submit"
            className="w-full"
            color="blue"
            disabled={processing}
          >
            Send Password Reset Link
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
};

export default ForgotPassword;
