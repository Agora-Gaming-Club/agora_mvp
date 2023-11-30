import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card } from 'flowbite-react';
import { Head, Link } from '@inertiajs/react';
import * as React from 'react';
import CountUp from 'react-countup';

type Props = {
  user: UserProfile;
};
const Index: FunctionComponent<Props> = ({ user }) => {
  return (
    <AuthenticatedLayout user={user} title="Find / Start a Challenge">
      <div className="max-w-5xl mx-auto py-5 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="max-w-sm">
            <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Initiate
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              consequat dictum viverra. Interdum et malesuada fames ac ante
              ipsum primis in faucibus.
            </p>

            {/*@ts-ignore*/}
            <Button as={Link} href="/challenge" color="blue">
              Create Challenge
            </Button>
          </Card>
          <Card className="max-w-sm">
            <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Accept
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              consequat dictum viverra. Interdum et malesuada fames ac ante
              ipsum primis in faucibus.
            </p>

            {/*@ts-ignore*/}
            <Button as={Link} href="/challenge/search" color="blue">
              Accept Challenge
            </Button>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
