import { FormEventHandler, FunctionComponent, PropsWithChildren } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { Button, Label, TextInput } from 'flowbite-react';
import Cookies from 'js-cookie';

const Register: FunctionComponent<any> = ({ props }) => {
  const page = usePage();
  console.log(page, Cookies.get());
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: 'solomon',
    last_name: 'solomon',
    username: 'test',
    email: 'test@test.com',
    phone: '5555555555',
    birthday: '10/04/99',
    state: 'MN',
    password: 'password',
    password_confirm: 'password',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    console.log(data);
    post('/accounts/register');
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

        <Button type="submit">Submit</Button>
      </form>
    </GuestLayout>
  );
};

export default Register;
