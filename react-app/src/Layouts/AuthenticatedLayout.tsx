import { FunctionComponent, PropsWithChildren } from 'react';

import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Logo from '@/Components/Logo';
import * as React from 'react';
import { HomeIcon, TrophyIcon } from '@heroicons/react/24/outline';

type Props = {
  user: any;
};
const AuthenticatedLayout: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const auth = usePage().props;
  const { post } = useForm({});
  console.log(auth, location.pathname);

  const handleLogout = () => {
    post('/accounts/logout');
  };

  return (
    <>
      <Navbar>
        <Navbar.Toggle />
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
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-500">
                <span className="text-xs font-medium leading-none text-white">
                  TW
                </span>
              </span>
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
        </div>
        <Navbar.Collapse>
          <Navbar.Link
            className="flex items-center text-sm"
            href="#"
            active={location.pathname === '/accounts/profile/'}
          >
            <HomeIcon className="h-5 w-5 mr-1" />
            Home
          </Navbar.Link>
          <Navbar.Link
            className="flex items-center text-sm"
            href="#"
            active={location.pathname === '/accounts/challenges/'}
          >
            <TrophyIcon className="h-5 w-5 mr-1" />
            Challenges
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-dark">
        {children}
      </div>
    </>
  );
};

export default AuthenticatedLayout;
