import { FunctionComponent, PropsWithChildren } from 'react';

import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Logo from '@/Components/Logo';
import * as React from 'react';

type Props = {
  user: any;
};
const AuthenticatedLayout: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const auth = usePage().props;
  const { post } = useForm({});
  console.log(auth);

  const handleLogout = () => {
    post('/accounts/logout');
  };

  return (
    <>
      <Navbar fluid>
        <Navbar.Brand href="https://flowbite-react.com">
          <Link href="/" className="flex items-center justify-start text-white">
            <div className="flex items-center justify-center  w-6 h-6 rounded-full mr-1">
              <Logo />
            </div>
            Agora Gaming Club
          </Link>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">About</Navbar.Link>
          <Navbar.Link href="#">Services</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-dark">
        {children}
      </div>
    </>
  );
};

export default AuthenticatedLayout;
