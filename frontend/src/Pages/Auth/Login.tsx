import React, { FormEventHandler, FunctionComponent, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Cookies from 'js-cookie';
import { Button, Label, TextInput } from 'flowbite-react';
import { TransformedErrors, transformErrors } from '@/Utils/form';

const Login: FunctionComponent = () => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post, processing, reset } = useForm({
    username: '',
    password: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });
  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post('/accounts/login', {
      onSuccess: (data) => {
        // window.location.href = data.props.url as unknown as string; // work around
      },
      onError: (err) => {
        setFormErrors(transformErrors(err));
      },
    });
  };
  return (
    <GuestLayout>
      <Head title="Sign In | Agora" />
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Email" />
          </div>
          <TextInput
            id="username"
            type="email"
            placeholder="Enter Your Email"
            value={data.username}
            onChange={(e) => setData('username', e.target.value)}
            shadow
            color={formErrors?.errors?.username ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.username ?? ''}</span>}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="Enter Your Password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            shadow
            color={formErrors?.errors?.password ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.password ?? ''}</span>}
          />
        </div>

        <Button
          color="blue"
          className="w-full"
          isProcessing={processing}
          type="submit"
        >
          Login
        </Button>
      </form>

      <div className="mt-5">
        <p className="text-center text-white">
          Don't have an account?{' '}
          <Link href="/accounts/register" className="text-blue-500 underline">
            Sign up here!
          </Link>{' '}
        </p>
      </div>
    </GuestLayout>
  );
};

export default Login;
