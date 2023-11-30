import React, { FormEventHandler, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Button, Label, TextInput } from 'flowbite-react';
import { TransformedErrors, transformErrors } from '@/Utils/form';

export default function UpdatePasswordForm({
  className = '',
}: {
  className?: string;
}) {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const passwordInput = useRef<HTMLInputElement>();
  const currentPasswordInput = useRef<HTMLInputElement>();

  const { data, setData, errors, post, reset, processing } = useForm({
    password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();

    post('/accounts/password_change', {
      onSuccess: (y) => {
        reset();
        setResetSuccess(true);
      },
      onError: (errors) => {
        setFormErrors(transformErrors(errors));

        if (errors.new_password) {
          reset('new_password', 'new_password_confirm');
          passwordInput.current?.focus();
        }

        if (errors.password) {
          reset('password');
          currentPasswordInput.current?.focus();
        }
      },
      only: ['errors', 'message'],
    });
  };

  return (
    <section className={className}>
      <header>
        <h1 className="text-white text-lg font-medium">Update Password</h1>
        <p className="text-gray-500 text-sm">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="password" value="Current Password" />

          <TextInput
            id="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type="password"
            className="mt-1 w-full"
            autoComplete="current-password"
            required
            color={formErrors?.errors.password ? 'failure' : 'gray'}
            helperText={formErrors?.errors.password ?? ''}
          />
        </div>

        <div>
          <Label htmlFor="new_password" value="New Password" />

          <TextInput
            id="new_password"
            value={data.new_password}
            onChange={(e) => setData('new_password', e.target.value)}
            type="password"
            className="mt-1 w-full"
            autoComplete="new-password"
            required
            color={formErrors?.errors.new_password ? 'failure' : 'gray'}
            helperText={formErrors?.errors.new_password ?? ''}
          />
        </div>

        <div>
          <Label htmlFor="new_password_confirm" value="Confirm Password" />

          <TextInput
            id="new_password_confirm"
            value={data.new_password_confirm}
            onChange={(e) => setData('new_password_confirm', e.target.value)}
            type="password"
            className="mt-1 w-full"
            autoComplete="new-password"
            required
            color={formErrors?.errors.new_password_confirm ? 'failure' : 'gray'}
            helperText={formErrors?.errors.new_password_confirm ?? ''}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" color="blue" disabled={processing}>
            Update Password
          </Button>

          <Transition
            show={resetSuccess}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-gray-600">Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
