import * as React from 'react';
import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card } from 'flowbite-react';
import { Link } from '@inertiajs/react';
import { UserProfile } from '@/schema';

type Props = {
  user: UserProfile;
};
const Index: FunctionComponent<Props> = ({ user }) => {
  return (
    <AuthenticatedLayout user={user} title="Find / Start a Challenge">
      <div className="max-w-5xl mx-auto py-5 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="max-w-md text-center">
            <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Start here to create your own challenge. You’ll choose a game and
              the amount you want to wager to generate a unique link to share
              with an opponent.
            </p>

            <Button as={Link as any} href="/challenge" color="blue">
              Create Challenge
            </Button>
          </Card>
          <Card className="max-w-md text-center">
            <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Accept
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Already have a code shared from an opponent? Accept the terms of
              their challenge and get started playing here.
            </p>

            <Button as={Link as any} href="/challenge/search" color="blue">
              Accept Challenge
            </Button>
          </Card>
        </div>

        <div className="max-w-sm mx-auto mt-4 md:mt-12">
          <h3 className="text-gray-400 text-center text-sm tracking-tight">
            Want to browse through existing active challenges? Head over to our{' '}
            <a href="https://https://discord.com/channels/1173680090371068006" target="_blank" className="underline">
              Agora Discord channel
            </a>{' '}
            to find a challenge that you can take on!
          </h3>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
