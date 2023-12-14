import React, {
  FormEventHandler,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button, Label, TextInput } from 'flowbite-react';
import GuestLayout from '@/Layouts/GuestLayout';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import Cookies from 'js-cookie';

type Props = {
  token: string;
};
const ResetPassword: FunctionComponent<Props> = ({ token }) => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post, processing, reset } = useForm({
    password: '',
    password_confirm: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });

  // useEffect(() => {
  //   return () => {
  //     reset('password', 'password_confirm');
  //   };
  // }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(`/accounts/password_reset/${token}`, {
      onError: (err) => {
        console.log(err);
        setFormErrors(transformErrors(err));
      },
      onSuccess: () => {
        console.log('success')
         window.location.href = '/accounts/login'
      },
      only: ['errors', 'message'],
    });
  };
  return (
    <GuestLayout>
      <Head title="Reset Password" />

      <form onSubmit={submit}>
        <div className="mt-4">
          <Label htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            placeholder="Enter New Password"
            color={formErrors?.errors?.password ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.password ?? ''}</span>}
            onChange={(e) => setData('password', e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="password_confirm" value="Confirm Password" />

          <TextInput
            type="password"
            name="password_confirm"
            value={data.password_confirm}
            className="mt-1 block w-full"
            autoComplete="new-password"
            placeholder="Enter Password Confirmation"
            color={formErrors?.errors?.password_confirm ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.password_confirm ?? ''}</span>}
            onChange={(e) => setData('password_confirm', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end mt-4">
          <Button
            type="submit"
            color="blue"
            className="ms-4"
            disabled={processing}
          >
            Reset Password
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
};

export default ResetPassword;
