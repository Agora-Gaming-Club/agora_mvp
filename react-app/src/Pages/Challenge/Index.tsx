import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card } from 'flowbite-react';
import { Head, Link } from '@inertiajs/react';
import * as React from 'react';
import CountUp from 'react-countup';

const Index: FunctionComponent = () => {
  return (
    <AuthenticatedLayout>
      <Head title="Find / Start a Challenge" />
      <div className="flex flex-col w-full pb-8">
        <div className="bg-[#7B1338] h-48 flex items-center justify-center ">
          <h1 className="py-4 text-white text-center text-3xl font-bold">
            Find a Challenge
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-5 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card href="#" className="max-w-sm">
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
          <Card href="#" className="max-w-sm">
            <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Accept
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              consequat dictum viverra. Interdum et malesuada fames ac ante
              ipsum primis in faucibus.
            </p>

            <Button color="blue">Accept Challenge</Button>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
