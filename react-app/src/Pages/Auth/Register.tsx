import React, {
  FormEventHandler,
  FunctionComponent,
  PropsWithChildren,
  useState,
} from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { Button, Label, Select, TextInput } from 'flowbite-react';
import Cookies from 'js-cookie';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import { formatPhoneNumberWhileTyping, stripPhoneNumber } from '@/Utils/phone';
import { states } from '@/Data/states';

const Register: FunctionComponent = () => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post, processing, reset, transform } = useForm({
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

    transform((data) => ({
      ...data,
      phone_number: stripPhoneNumber(data.phone_number),
    }));
    // console.log(data);
    post('/accounts/register', {
      onError: (err) => {
        setFormErrors(transformErrors(err));
      },
    });
  };

  return (
    <GuestLayout>
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
            color={formErrors?.errors?.password_confirm ? 'failure' : 'gray'}
            helperText={
              <span>{formErrors?.errors?.password_confirm ?? ''}</span>
            }
          />
        </div>

        <Button
          className="w-full bg-primary"
          isProcessing={processing}
          type="submit"
        >
          Create Account
        </Button>
      </form>
    </GuestLayout>
  );
};

export default Register;
