import { FunctionComponent } from 'react';
import { currencyFormatter } from '@/Utils/money';
import { CursorArrowRaysIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Button } from 'flowbite-react';
import { Link } from '@inertiajs/react';
import { Wager, WagerStatus } from '@/schema';

type Props = {
  wager: Wager;
};

const ChallengeCard: FunctionComponent<Props> = ({ wager }) => {
  return (
    <li className="relative flex items-center space-x-4 bg-[#1F2A37] hover:bg-gray-700 px-5 py-4">
      <div className="min-w-0 flex-auto">
        <h2 className="min-w-0 font-semibold leading-6 text-white">
          {wager.challenger_gamer_tag}
        </h2>
        <h3 className="min-w-0 text-sm leading-6 text-gray-400">
          {wager.game.game}
        </h3>
        <div className="mt-1 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
          <p className="truncate">{currencyFormatter.format(wager.amount)}</p>
          <svg
            viewBox="0 0 2 2"
            className="h-0.5 w-0.5 flex-none fill-gray-300"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p className="whitespace-nowrap capitalize">{wager.status}</p>
        </div>
      </div>
      <ChallengeButton
        status={wager.status}
        href={`/challenge/${wager.unique_code}`}
      />
    </li>
  );
};

const ChallengeButton: FunctionComponent<{
  status: WagerStatus;
  href: string;
}> = ({ status, href }) => {
  switch (status) {
    case WagerStatus.AWAITING_RESPONSE:
      return (
        // @ts-ignore
        <Button size="xs" as={Link} href={href} color="blue" pill>
          <ShareIcon className="h-4 w-4 mr-1" />
          Share Code
        </Button>
      );
    case WagerStatus.IN_PROGRESS:
      return (
        // @ts-ignore
        <Button as={Link} href={href} size="xs" color="blue" pill>
          <CursorArrowRaysIcon className="h-4 w-4 mr-1" />
          Select Outcome
        </Button>
      );
    case WagerStatus.ACCEPTED:
      return (
        // @ts-ignore
        <Button as={Link} href={href} size="xs" color="blue" pill>
          <CursorArrowRaysIcon className="h-4 w-4 mr-1" />
          Make Payment
        </Button>
      );
    case WagerStatus.DISPUTED:
      return <button>Dispute Status</button>;
    default:
      return <></>;
  }
};

export default ChallengeCard;
