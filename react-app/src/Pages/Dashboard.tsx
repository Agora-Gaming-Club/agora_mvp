import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from 'flowbite-react';
import CountUp from 'react-countup';
import ChallengeCard from '@/Components/ChallengeCard';
import { Pagination, UserProfile, Wager } from '@/schema';

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

      <div className="container mx-auto px-5">
        <h3 className="text-gray-500 text-lg">Active</h3>
        <ul className="space-y-1 w-full">
          {active.result.map((wager) => (
            <ChallengeCard key={wager.unique_code} wager={wager} />
          ))}
        </ul>
      </div>

      <div className="container mx-auto px-5 py-8">
        <h3 className="text-gray-500 text-lg">Old</h3>
        <ul className="space-y-1 w-full">
          {old.result.map((wager) => (
            <ChallengeCard key={wager.unique_code} wager={wager} />
          ))}
        </ul>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
