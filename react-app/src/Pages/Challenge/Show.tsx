import { FunctionComponent, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import * as React from 'react';
import { Head } from '@inertiajs/react';
import { Button, Card, TextInput } from 'flowbite-react';
import { ClipboardIcon } from '@heroicons/react/24/solid';
import { useCopyToClipboard } from '@/Hooks/useCopyToClipboard';

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
  console.log(challenge, game, created_at);
  // show unique if status: awaiting_response & if they created it
  // show "accept": awaiting_response & if they did not create it

  const handleCopy = async () => {
    await copy(location.host + '/challenge/' + challenge.unique_code);
  };
  return (
    <AuthenticatedLayout>
      <Head title="Challenge Detail" />
      <div className="flex flex-col w-full pb-8">
        <div className="bg-[#7B1338] h-48 flex items-center justify-center ">
          <div>
            <h1 className="py-4 text-white text-center text-3xl font-bold">
              Challenge Detail
            </h1>
            <h2 className="text-white text-center font-medium">
              Send the code below to challenge your opponent.
            </h2>
          </div>
        </div>

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
                <h3 className="text-gray-500">{challenge.unique_code}</h3>
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
      </div>
    </AuthenticatedLayout>
  );
};

export default Show;
