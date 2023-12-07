import { useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';
import { Label, TextInput } from 'flowbite-react';
import { formatPhoneNumber } from '@/Utils/phone';
import { UserProfile } from '@/schema';

export default function UpdateProfileInformation({
  className = '',
  user,
}: {
  className?: string;
  user: UserProfile;
}) {
  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      // name: user.name,
      // email: user.email,
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch('/');
  };

  return (
    <section className={className}>
      <header>
        <h1 className="text-white text-lg font-medium"> Profile Information</h1>
        <p className="text-gray-500 text-sm">
          Contact the Agora admin to update details of your account.
        </p>
      </header>

      <form className="mt-6 space-y-6">
        <div>
          <Label htmlFor="first_name" value="First Name" />

          <TextInput
            id="first_name"
            className="mt-1 block w-full"
            value={user.first_name}
            disabled
          />
        </div>

        <div>
          <Label htmlFor="last_name" value="Last Name" />

          <TextInput
            id="last_name"
            className="mt-1 block w-full"
            value={user.last_name}
            disabled
          />
        </div>

        <div>
          <Label htmlFor="username" value="Username" />

          <TextInput
            id="username"
            type="text"
            className="mt-1 block w-full"
            value={user.username}
            disabled
          />
        </div>

        <div>
          <Label htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={user.email}
            disabled
          />
        </div>

        <div>
          <Label htmlFor="phone" value="Phone" />

          <TextInput
            id="phone"
            type="phone_number"
            className="mt-1 block w-full"
            value={formatPhoneNumber(user.phone_number)}
            disabled
          />
        </div>

        <div>
          <Label htmlFor="birthday" value="Birthday" />

          <TextInput
            id="birthday"
            type="date"
            className="mt-1 block w-full"
            // @ts-ignore
            value={user.birthday}
            disabled
          />
        </div>

        <div>
          <Label htmlFor="state" value="State" />

          <TextInput
            id="state"
            type="text"
            className="mt-1 block w-full"
            // @ts-ignore
            value={user.state}
            disabled
          />
        </div>

        {/*<div className="flex items-center gap-4">*/}
        {/*  <Button color="blue" disabled={processing}>*/}
        {/*    Save*/}
        {/*  </Button>*/}

        {/*  <Transition*/}
        {/*    show={recentlySuccessful}*/}
        {/*    enter="transition ease-in-out"*/}
        {/*    enterFrom="opacity-0"*/}
        {/*    leave="transition ease-in-out"*/}
        {/*    leaveTo="opacity-0"*/}
        {/*  >*/}
        {/*    <p className="text-sm text-gray-600">Saved.</p>*/}
        {/*  </Transition>*/}
        {/*</div>*/}
      </form>
    </section>
  );
}
