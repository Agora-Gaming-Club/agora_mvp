import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import { Card } from 'flowbite-react';
import { formatUniqueCode } from '@/Utils/string';
import { ArrowUpOnSquareIcon, ClipboardIcon } from '@heroicons/react/24/solid';
import { UserProfile, Wager } from '@/schema';
import { useCopyToClipboard } from '@/Hooks/useCopyToClipboard';

type Props = {
  challenge: Wager;
  user: UserProfile;
  discordLink?: string
};

const ShareChallengePartial: FunctionComponent<Props> = ({
  challenge,
  user,
}) => {
  console.log(challenge)
  const [copied, setCopied] = useState(false);
  const [copiedValue, copy] = useCopyToClipboard();
  const handleCopy = async () => {
    await copy(`https://${location.host}/challenge/${challenge.unique_code}`);
  };
  return (
    <Card className="max-w-xl text-center mx-auto">
      <h3 className="text-gray-500 font-medium text-sm">Challenge</h3>
      <h1 className="text-white text-2xl font-semibold">
        {challenge.game.game}
      </h1>
      <h1 className="text-gray-300 font-medium">
        {/*TODO: Add dayjs as dependency*/}
        {new Date(challenge.created_at).toLocaleDateString()}
      </h1>

      <p className="text-gray-400 text-xs">
        Copy and share your challenge URL below:
      </p>
      <div className="flex items-center justify-center">
        <div className="rounded w-full bg-dark flex items-center justify-between p-2 border border-gray-400">
          <h3 className="text-gray-500 uppercase">
            {formatUniqueCode(challenge.unique_code)}
          </h3>
          <button id="copyUniqueCode" onClick={handleCopy}>
            <ClipboardIcon className="text-blue-500 h-6 w-6" />
          </button>
        </div>
      </div>
      {copiedValue && (
        <small className="mt-1 text-green-500 text-sm">
          Copied challenge code to clipboard.
        </small>
      )}

      <a
        href={challenge.game.discord_link}
        target="_blank"
        className="text-gray-300 underline inline-flex justify-center items-center"
      >
        Find Opponents on Discord{' '}
        <ArrowUpOnSquareIcon className="h-4 w-4 ml-1" />
      </a>
    </Card>
  );
};

export default ShareChallengePartial;
