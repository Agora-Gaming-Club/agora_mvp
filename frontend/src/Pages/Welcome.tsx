import * as React from 'react';
import Logo from '@/Components/Logo';
import { Button } from 'flowbite-react';
import { Head, Link } from '@inertiajs/react';

const Welcome = (): React.ReactNode => {
  return (
    <div className="bg-dark h-screen">
      <Head title="Welcome to Agora" />
      <div className="px-4 py-16 mx-auto max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-xl mx-auto lg:max-w-2xl">
          <div className="flex flex-col justify-between mb-16 text-center sm:mb-0">
            <Link href="/" className="mb-6 mx-auto">
              <div className="flex items-center justify-center w-12 h-12 rounded-full">
                <Logo />
              </div>
            </Link>
            <div className="max-w-xl mb-10 md:mx-auto text-center lg:max-w-2xl md:mb-12">
              <span className="text-sm text-white">Welcome to</span>

              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl md:mx-auto">
                Agora Gaming
              </h2>
              <p className="text-gray-500 text-sm">
                Back yourself. Challenge the best. Win money.
              </p>
            </div>
            <div className="block sm:flex items-center justify-between sm:gap-x-8">
              <Link className="w-full" href="/accounts/login">
                <Button id='landingLoginButton' color="blue" className="w-full">
                  Login
                </Button>
              </Link>
              <Link className="w-full" href="/accounts/register">
                <Button
                  id='landingRegisterButton'
                  color="blue"
                  outline={true}
                  className="w-full mt-4 sm:mt-0"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
