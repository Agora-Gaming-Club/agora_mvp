import { FormEventHandler, FunctionComponent, PropsWithChildren } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { Button, Label, TextInput } from 'flowbite-react';
import Cookies from 'js-cookie';

const Register: FunctionComponent<any> = ({ props }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    birthday: '', // YYYY-MM-DD
    state: 'MN',
    password: '',
    password_confirm: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    console.log(data);
    // console.log(data);
    post('/accounts/register', {
      onSuccess: (data) => {
        // window.location.href = data.props.url as unknown as string; // work around
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
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="phone" value="Phone" />
          </div>
          <TextInput
            id="phone"
            type="tel"
            placeholder="Enter Your Phone"
            value={data.phone_number}
            onChange={(e) => setData('phone_number', e.target.value)}
            shadow
          />
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
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </GuestLayout>
  );
};

export default Register;
