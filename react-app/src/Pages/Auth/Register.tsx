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
    // post('/accounts/register');
    router.post('/accounts/register', {
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
  };

  return (
    <GuestLayout>
      <form onSubmit={submit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="name@flowbite.com"
            value={data.email}
            onChange={(e) => setData('email', data.email)}
            shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Your username" />
          </div>
          <TextInput
            id="email2"
            type="username"
            placeholder="name@flowbite.com"
            shadow
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2" value="Your email" />
          </div>
          <TextInput
            id="email2"
            type="email"
            placeholder="name@flowbite.com"
            shadow
          />
        </div>
        <TextInput />
        <TextInput />

        <Button type="submit">Submit</Button>
      </form>
    </GuestLayout>
  );
};

export default Register;
