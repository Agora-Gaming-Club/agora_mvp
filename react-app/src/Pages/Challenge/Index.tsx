import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card } from 'flowbite-react';

const Index: FunctionComponent = () => {
  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto py-5 px-4">
        <h1 className="text-white text-4xl font-bold text-center">
          Find / Start a Challenge
        </h1>
      </div>
      <div className="flex items-center justify-center h-screen">
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

            <Button color="blue">Create Challenge</Button>
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
