import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from 'flowbite-react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import CountUp from 'react-countup';
import { classNames } from '@/Utils/styles';
import { Head } from '@inertiajs/react';

const statuses = {
  pending: 'text-yellow-500 bg-yellow-100/10',
  accepted: 'text-green-400 bg-green-400/10',
  waiting: 'text-gray-400 bg-gray-400/10',
};
// pending
// accepted
// waiting

const environments = {
  Pending: 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/20',
  Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
};
const challenges = [
  {
    id: 1,
    href: '#',
    projectName: 'Mortal Kombat',
    teamName: 'Dr. Disrespect',
    status: 'pending',
    statusText: 'Get Code',
    description: '$50.00',
    environment: 'Pending',
  },
  {
    id: 2,
    href: '#',
    projectName: 'mobile-api',
    teamName: 'Planetaria',
    status: 'accepted',
    statusText: 'Deployed 3m ago',
    description: 'Deploys from GitHub',
    environment: 'Production',
  },
  {
    id: 3,
    href: '#',
    projectName: 'tailwindcss.com',
    teamName: 'Tailwind Labs',
    status: 'pending',
    statusText: 'Deployed 3h ago',
    description: 'Deploys from GitHub',
    environment: 'Pending',
  },
  {
    id: 4,
    href: '#',
    projectName: 'api.protocol.chat',
    teamName: 'Protocol',
    status: 'waiting',
    statusText: 'Failed to deploy 6d ago',
    description: 'Deploys from GitHub',
    environment: 'Pending',
  },
];

const wagers: Wager[] = [
  {
    id: 1,
    challenger_id: 1,
    respondent_id: 1,
    amount: 50,
    notes: 'Foobar baz',
    game: 'Mortal Kombat 1',
    gamer_tag: 'Dr Disrespect',
    status: 'accepted',
    created_at: new Date(),
    updated_at: new Date(),
    challenger_vote: '1',
    respondent_vote: '1',
    unique_code: 'CIN NSU',
  },
  {
    id: 2,
    challenger_id: 1,
    respondent_id: 1,
    amount: 50,
    notes: 'Foobar baz',
    game: 'Mortal Kombat 1',
    gamer_tag: 'Dr Disrespect',
    status: 'accepted',
    created_at: new Date(),
    updated_at: new Date(),
    challenger_vote: '1',
    respondent_vote: '1',
    unique_code: 'CIN NSU',
  },
  {
    id: 3,
    challenger_id: 1,
    respondent_id: 1,
    amount: 50,
    notes: 'Foobar baz',
    game: 'Mortal Kombat 1',
    gamer_tag: 'Dr Disrespect',
    status: 'accepted',
    created_at: new Date(),
    updated_at: new Date(),
    challenger_vote: '1',
    respondent_vote: '1',
    unique_code: 'CIN NSU',
  },
];

const Dashboard: FunctionComponent = () => {
  const getStatusBadge = (s: any) => {
    switch (s) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-100/10';
      case 'accepted':
        return 'text-green-400 bg-green-400/10';
      case 'waiting':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return '';
    }
  };
  const getCtaBadge = (s: any) => {
    //   Pending: 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/20',
    //   Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
    switch (s) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-100/10';
      case 'accepted':
        return 'text-green-400 bg-green-400/10';
      case 'waiting':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return '';
    }
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="flex flex-col w-full pb-8">
        <div className="bg-[#7B1338] h-48 flex items-center justify-center ">
          <h1 className="py-4 text-white text-center text-3xl font-bold">
            Dashboard
          </h1>
        </div>

        <div className="max-w-xl mx-auto">
          <Card className="-translate-y-1/2 w-64 flex items-center justify-center">
            <h1 className="text-4xl text-white text-center font-extrabold tracking-tight">
              <CountUp
                duration={1.25}
                start={0}
                end={500}
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
            {wagers.map((wager) => (
              <li
                key={wager.id}
                className="relative flex items-center space-x-4 bg-[#1F2A37] hover:bg-gray-700 px-5 py-4"
              >
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <div
                      className={classNames(
                        getStatusBadge(wager.status),
                        'flex-none rounded-full p-1'
                      )}
                    >
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                      <a href="#" className="flex gap-x-2">
                        <span className="truncate">{wager.gamer_tag}</span>
                        <span className="text-gray-400">/</span>
                        <span className="whitespace-nowrap">{wager.game}</span>
                        <span className="absolute inset-0" />
                      </a>
                    </h2>
                  </div>
                  <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                    <p className="truncate">
                      {currencyFormatter.format(wager.amount)}
                    </p>
                    <svg
                      viewBox="0 0 2 2"
                      className="h-0.5 w-0.5 flex-none fill-gray-300"
                    >
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="whitespace-nowrap">pending</p>
                  </div>
                </div>
                <div
                  className={classNames(
                    getCtaBadge('pending'),
                    'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  Get Code
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
