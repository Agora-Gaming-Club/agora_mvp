import * as React from 'react';
import { FunctionComponent, PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import Logo from '@/Components/Logo';

const GuestLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-dark">
      <div>
        <Link href="/" className="mb-6 mx-auto">
          <div className="flex items-center justify-center w-12 h-12 rounded-full">
            <Logo />
          </div>
        </Link>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4">{children}</div>
    </div>
  );
};

export default GuestLayout;
