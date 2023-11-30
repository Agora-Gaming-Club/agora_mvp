import React, { FormEventHandler, FunctionComponent, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import Cookies from 'js-cookie';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import { formatPhoneNumberWhileTyping, stripPhoneNumber } from '@/Utils/phone';
import { states } from '@/Data/states';

const Register: FunctionComponent = () => {
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post, processing } = useForm({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    birthday: '', // YYYY-MM-DD
    state: '',
    password: '',
    password_confirm: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!openTermsModal) {
      setOpenTermsModal(true);
      return;
    }

    data.phone_number = stripPhoneNumber(data.phone_number);
    post('/accounts/register', {
      onError: (err) => {
        setFormErrors(transformErrors(err));
      },
      onBefore: () => setOpenTermsModal(false),
    });
  };

  return (
    <GuestLayout>
      <Head title="Sign Up | Agora" />
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="first_name" value="First Name" />
          </div>
          <TextInput
            id="first_name"
            type="first_name"
            placeholder="Enter Your First Name"
            value={data.first_name}
            onChange={(e) => setData('first_name', e.target.value)}
            shadow
            required
            color={formErrors?.errors?.first_name ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.first_name ?? ''}</span>}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="last_name" value="Last Name" />
          </div>
          <TextInput
            id="last_name"
            type="last_name"
            placeholder="Enter Your Last Name"
            value={data.last_name}
            onChange={(e) => setData('last_name', e.target.value)}
            shadow
            required
            color={formErrors?.errors?.last_name ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.last_name ?? ''}</span>}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="Enter Your Email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            shadow
            required
            color={formErrors?.errors?.email ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.email ?? ''}</span>}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            placeholder="Enter Your Username"
            value={data.username}
            onChange={(e) => setData('username', e.target.value)}
            shadow
            required
            color={formErrors?.errors?.username ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.username ?? ''}</span>}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="phone" value="Phone" />
          </div>
          <TextInput
            id="phone"
            type="tel"
            addon="+1"
            placeholder="Enter Your Phone"
            value={data.phone_number}
            onChange={(e) =>
              setData('phone_number', formatPhoneNumberWhileTyping(e) as string)
            }
            required
            shadow
            color={formErrors?.errors?.phone_number ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.phone_number ?? ''}</span>}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="states" value="State" />
          </div>
          <Select
            shadow
            value={data.state}
            onChange={(e) => setData('state', e.target.value)}
            id="states"
            required
            color={formErrors?.errors?.state ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.state ?? ''}</span>}
          >
            <option value="" disabled>
              Select your state
            </option>
            {states.map((state) => (
              <option key={state.abbrev} value={state.abbrev}>
                {state.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="birthday" value="Birthday" />
          </div>
          <TextInput
            id="birthday"
            type="date"
            placeholder="Enter Your Birthday"
            value={data.birthday}
            onChange={(e) => setData('birthday', e.target.value)}
            shadow
            required
            color={formErrors?.errors?.birthday ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.birthday ?? ''}</span>}
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
            required
            color={formErrors?.errors?.password ? 'failure' : 'gray'}
            helperText={<span>{formErrors?.errors?.password ?? ''}</span>}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password_confirm" value="Confirm Password" />
          </div>
          <TextInput
            id="password_confirm"
            type="password"
            placeholder="Confirm Your Password"
            value={data.password_confirm}
            onChange={(e) => setData('password_confirm', e.target.value)}
            shadow
            required
            color={formErrors?.errors?.password_confirm ? 'failure' : 'gray'}
            helperText={
              <span>{formErrors?.errors?.password_confirm ?? ''}</span>
            }
          />
        </div>

        <Button
          color="blue"
          className="w-full"
          isProcessing={processing}
          type="submit"
        >
          Create Account
        </Button>

        <div className="mt-5">
          <p className="text-center text-white">
            Already have an account?{' '}
            <Link href="/accounts/login" className="text-blue-500 underline">
              Sign in here!
            </Link>{' '}
          </p>
        </div>

        <Modal show={openTermsModal} onClose={() => setOpenTermsModal(false)}>
          <Modal.Header>Terms of Service</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                With less than a month to go before the European Union enacts
                new consumer privacy laws for its citizens, companies around the
                world are updating their terms of service agreements to comply.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                The European Union’s General Data Protection Regulation
                (G.D.P.R.) goes into effect on May 25 and is meant to ensure a
                common set of data rights in the European Union. It requires
                organizations to notify users as soon as possible of high-risk
                data breaches that could personally affect them.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              id="submit"
              color="blue"
              type="submit"
              isProcessing={processing}
              onClick={submit}
            >
              I accept
            </Button>
            <Button
              type="button"
              color="gray"
              onClick={() => setOpenTermsModal(false)}
            >
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
    </GuestLayout>
  );
};

export default Register;
