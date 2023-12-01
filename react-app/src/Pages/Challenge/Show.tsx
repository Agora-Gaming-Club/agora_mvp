import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from 'flowbite-react';
import { ClipboardIcon } from '@heroicons/react/24/solid';
import { useCopyToClipboard } from '@/Hooks/useCopyToClipboard';
import { formatUniqueCode } from '@/Utils/string';

type Props = {
  challenge: Wager;
  challenger: any;
  user: any;
  respondent: any;
  viewer: any;
  game: any;
  created_at: any;
};
const Show: FunctionComponent<Props> = ({
  challenge,
  challenger,
  user,
  game,
  created_at,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedValue, copy] = useCopyToClipboard();
  // show unique if status: awaiting_response & if they created it
  // show "accept": awaiting_response & if they did not create it

  const handleCopy = async () => {
    await copy(location.host + '/challenge/' + challenge.unique_code);
  };
  return (
    <AuthenticatedLayout
      user={user}
      title="Challenge Detail"
      description="Send the code below to challenge your opponent."
    >
      <div className="container mx-auto py-5 px-4">
        <Card className="max-w-xl text-center mx-auto">
          <h3 className="text-gray-500 font-medium text-sm">Challenge</h3>
          <h1 className="text-white text-2xl font-semibold">{game}</h1>
          <h1 className="text-gray-300 font-medium">
            {/*TODO: Add dayjs as dependency*/}
            {new Date(created_at).toLocaleDateString()}
          </h1>

          <div className="flex items-center justify-center">
            <div className="rounded w-full bg-dark flex items-center justify-between p-2 border border-gray-400">
              <h3 className="text-gray-500 uppercase">
                {formatUniqueCode(challenge.unique_code)}
              </h3>
              <button onClick={handleCopy}>
                <ClipboardIcon className="text-blue-500 h-6 w-6" />
              </button>
            </div>
          </div>
          {copiedValue && (
            <small className="mt-1 text-green-500 text-sm">
              Copied challenge code to clipboard.
            </small>
          )}

          <a href="#" className="text-gray-300 underline">
            Link to Discord
          </a>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default Show;
