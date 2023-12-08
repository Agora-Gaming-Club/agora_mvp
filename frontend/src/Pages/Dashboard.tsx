import * as React from 'react';
import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card } from 'flowbite-react';
import CountUp from 'react-countup';
import ChallengeCard from '@/Components/ChallengeCard';
import { Pagination, UserProfile, Wager } from '@/schema';
import { Link } from '@inertiajs/react';

type Props = {
  user: UserProfile;
  active: Pagination<Wager>;
  old: Pagination<Wager>;
};

const Dashboard: FunctionComponent<Props> = ({ user, active, old }) => {
  return (
    <AuthenticatedLayout user={user} title="Dashboard">
      <div className="max-w-xl mx-auto">
        <Card className="-translate-y-1/2 w-64 flex items-center justify-center">
          <h1 className="text-4xl text-white text-center font-extrabold tracking-tight">
            <CountUp
              duration={1.25}
              start={0}
              end={user.winnings}
              prefix="$"
              decimals={2}
            />
          </h1>
          <h2 className="text-green-500 text-center">Total Winnings</h2>
        </Card>
      </div>

      {active.result.length > 0 && (
        <div className="container mx-auto px-5">
          <h3 className="text-gray-500 text-lg">Active</h3>
          <ul className="space-y-1 w-full">
            {active.result.map((wager) => (
              <ChallengeCard
                key={wager.unique_code}
                challenge={wager}
                user={user}
              />
            ))}
          </ul>
        </div>
      )}

      {old.result.length > 0 && (
        <div className="container mx-auto px-5 py-8">
          <h3 className="text-gray-500 text-lg">Old</h3>
          <ul className="space-y-1 w-full">
            {old.result.map((wager) => (
              <ChallengeCard
                key={wager.unique_code}
                challenge={wager}
                user={user}
              />
            ))}
          </ul>
        </div>
      )}

      {old.result.length < 1 && active.result.length < 1 ? (
        <Card className="max-w-md mx-auto">
          <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Initiate
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Start here to create your own challenge. You’ll choose a game and
            the amount you want to wager to generate a unique link to share with
            an opponent.
          </p>

          {/*@ts-ignore*/}
          <Button as={Link} href="/challenge" color="blue">
            Create Challenge
          </Button>
        </Card>
      ) : null}
    </AuthenticatedLayout>
  );
};

export default Dashboard;
