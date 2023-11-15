import { FunctionComponent, PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';
import Logo from '@/Components/Logo';

const GuestLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0  bg-[#111928]">
      <div>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4">{children}</div>
    </div>
  );
};

export default GuestLayout;
