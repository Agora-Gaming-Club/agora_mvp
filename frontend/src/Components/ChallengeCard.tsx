import { FunctionComponent } from 'react';
import { currencyFormatter } from '@/Utils/money';
import { CursorArrowRaysIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Badge, Button } from 'flowbite-react';
import { Link } from '@inertiajs/react';
import { UserProfile, Wager, WagerStatus } from '@/schema';
import { BanknotesIcon } from '@heroicons/react/24/solid';

type Props = {
  challenge: Wager;
  user: UserProfile;
};

const ChallengeCard: FunctionComponent<Props> = ({ challenge, user }) => {
  return (
    <li className="relative flex items-center space-x-4 bg-[#1F2A37] hover:bg-gray-700 px-5 py-4">
      <div className="min-w-0 flex-auto">
        <h2 className="min-w-0 font-semibold leading-6 text-white">
          {challenge.challenger_gamer_tag}
        </h2>
        <h3 className="min-w-0 text-sm leading-6 text-gray-400">
          {challenge.game.game}
        </h3>
        <div className="mt-1 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
          <p className="truncate">
            {currencyFormatter.format(challenge.amount)}
          </p>
          <svg
            viewBox="0 0 2 2"
            className="h-0.5 w-0.5 flex-none fill-gray-300"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p className="whitespace-nowrap capitalize">{challenge.status}</p>
             <svg
            viewBox="0 0 2 2"
            className="h-0.5 w-0.5 flex-none fill-gray-300"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p className="whitespace-nowrap capitalize">{challenge.unique_code}</p>
        </div>
      </div>
      <ChallengeButton
        user={user}
        challenge={challenge}
        href={`/challenge/${challenge.unique_code}`}
      />
    </li>
  );
};

const ChallengeButton: FunctionComponent<{
  challenge: Wager;
  href: string;
  user: UserProfile;
}> = ({ challenge, href, user }) => {
  const status = challenge.status;
  switch (status) {
    case WagerStatus.AWAITING_RESPONSE:
      return (
        <Button id="shareCode" size="xs" className='text-xs' as={Link as any} href={href} color="blue" pill>
          <ShareIcon className="h-4 w-4 mr-1" />
          Share Code
        </Button>
      );
    case WagerStatus.IN_PROGRESS:
      // check if already selected
      // check if not selected
      return (
        <Button id="selectOutcome" as={Link as any} href={href} size="xs" className='text-xs' color="blue" pill>
          <CursorArrowRaysIcon className="h-4 w-4 mr-1" />
          Select Outcome
        </Button>
      );
    case WagerStatus.ACCEPTED:
      // check if already paid
      // check if not paid
      return (
        <Button id="makePayment" as={Link as any} href={href} size="xs" className='text-xs' color="blue" pill>
          <CursorArrowRaysIcon className="h-4 w-4 mr-1" />
          Make Payment
        </Button>
      );
    case WagerStatus.DISPUTED:
      return (
        <Button id="viewDispute" as={Link as any} href={href} size="xs" className='text-xs' color="blue" pill>
          View Dispute Status
        </Button>
      );
    case WagerStatus.COMPLETED:
      if (challenge.winner_id == user.user && !challenge.winner_paypal) {
        return (
          <Button id="getPaid" as={Link as any} href={href} size="xs" className='text-xs' color="blue" pill>
            <BanknotesIcon className="h-4 w-4 mr-1" />
            Get Paid
          </Button>
        );
      }

      if (challenge.winner_id == user.user && challenge.winner_paypal) {
        return <Badge size='xs' color="success">You Won</Badge>;
      }

      return <></>;
    default:
      return <></>;
  }
};

export default ChallengeCard;
