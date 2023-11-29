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
  const globalProps: any = usePage().props;
  const { post } = useForm({});
  console.log(globalProps, location.pathname);

  const handleLogout = () => {
    post('/accounts/logout');
  };

  return (
    <>
      <Navbar fluid>
        <Navbar.Toggle />
        <Navbar.Brand
          className="flex items-center space-x-5"
          href="https://flowbite-react.com"
        >
          <Link href="/" className="flex items-center justify-start text-white">
            <div className="flex items-center justify-center  w-6 h-6 rounded-full mr-1">
              <Logo />
            </div>
            Agora Gaming Club
          </Link>

          <div className="hidden md:flex list-none ml-5">
            <Navbar.Link active={location.pathname === '/dashboard'}>
              <Link
                className="flex items-center text-sm ml-5"
                href="/dashboard"
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                Home
              </Link>
            </Navbar.Link>
            <Navbar.Link active={location.pathname === '/challenges'}>
              <Link
                className="flex items-center text-sm ml-5"
                href="/challenges"
              >
                <TrophyIcon className="h-5 w-5 mr-1" />
                Challenges
              </Link>
            </Navbar.Link>
          </div>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-500">
                <span className="text-xs font-medium leading-none text-white uppercase">
                  {globalProps.user.first_name.substring(0, 1)}
                  {globalProps.user.last_name.substring(0, 1)}
                </span>
              </span>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {globalProps.user.first_name} {globalProps.user.last_name}
              </span>
              <span className="block truncate text-sm font-medium">
                {globalProps.user.email}
              </span>
            </Dropdown.Header>
            {/*<Dropdown.Item>Dashboard</Dropdown.Item>*/}
            {/*<Dropdown.Item>Settings</Dropdown.Item>*/}
            {/*<Dropdown.Item>Earnings</Dropdown.Item>*/}
            {/*<Dropdown.Divider />*/}
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
        <Navbar.Collapse className="">
          <div className="block md:hidden">
            <Navbar.Link
              className="flex items-center text-sm"
              href="/dashboard"
              active={location.pathname === '/dashboard'}
            >
              <HomeIcon className="h-5 w-5 mr-1" />
              Home
            </Navbar.Link>
            <Navbar.Link
              className="flex items-center text-sm"
              href="/challenges/"
              active={location.pathname === '/challenges/'}
            >
              <TrophyIcon className="h-5 w-5 mr-1" />
              Challenges
            </Navbar.Link>
          </div>
        </Navbar.Collapse>
      </Navbar>
      <div className="min-h-screen sm:pt-0 bg-dark">{children}</div>
    </>
  );
};

export default AuthenticatedLayout;
