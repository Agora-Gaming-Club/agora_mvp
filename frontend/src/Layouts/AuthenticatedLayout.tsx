import * as React from 'react';
import { FunctionComponent, PropsWithChildren } from 'react';

import { Dropdown, Navbar } from 'flowbite-react';
import { Head, Link, useForm } from '@inertiajs/react';
import Logo from '@/Components/Logo';
import { HomeIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { UserProfile } from '@/schema';

type Props = {
  user: UserProfile;
  title?: string;
  description?: string;
};
const AuthenticatedLayout: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  title,
  description,
  user,
}) => {
  const { post } = useForm({});

  const handleLogout = () => {
    post('/accounts/logout');
  };

  return (
    <>
      <Head title={title ?? 'Agora Gaming'} />
      <Navbar fluid>
        <Navbar.Toggle />
        <Navbar.Brand as="div" className="flex items-center space-x-5">
          <Link href="/" className="flex items-center justify-start text-white">
            <div className="flex items-center justify-center  w-6 h-6 rounded-full mr-1">
              <Logo />
            </div>
            Agora Gaming Club
          </Link>

          <div className="hidden md:flex list-none ml-5">
            <Navbar.Link
              className="flex items-center text-sm ml-5"
              href="/dashboard"
              as={Link}
              active={location.pathname === '/dashboard'}
            >
              <HomeIcon className="h-5 w-5 mr-1" />
              Home
            </Navbar.Link>
            <Navbar.Link
              className="flex items-center text-sm ml-5"
              href="/challenges"
              as={Link}
              active={location.pathname === '/challenges'}
            >
              <TrophyIcon className="h-5 w-5 mr-1" />
              Challenges
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
                  {user.first_name.substring(0, 1)}
                  {user.last_name.substring(0, 1)}
                </span>
              </span>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user.first_name} {user.last_name}
              </span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            {/*@ts-ignore*/}
            <Dropdown.Item href="/accounts/profile/edit" as={Link}>
              View Profile
            </Dropdown.Item>
            {/*@ts-ignore*/}
            <Dropdown.Item href="/accounts/password_change" as={Link}>
              Update Password
            </Dropdown.Item>
            <Dropdown.Divider />
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
              href="/challenges"
              active={location.pathname === '/challenges/'}
            >
              <TrophyIcon className="h-5 w-5 mr-1" />
              Challenges
            </Navbar.Link>
          </div>
        </Navbar.Collapse>
      </Navbar>
      <div className="min-h-screen sm:pt-0 bg-dark">
        <div className="flex flex-col w-full pb-8">
          <div className="bg-agora-red h-48 flex items-center justify-center ">
            {(title || description) && (
              <div>
                <h1 className="py-4 text-white text-center text-3xl font-bold">
                  {title}
                </h1>
                <h2 className="text-white text-center font-medium">
                  {description}
                </h2>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthenticatedLayout;
