import * as React from 'react';
import { FormEventHandler, FunctionComponent, useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { formatUniqueCodeWhileTyping } from '@/Utils/string';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import Cookies from 'js-cookie';
import { UserProfile } from '@/schema';

type Props = {
  user: UserProfile;
};
const Search: FunctionComponent<Props> = ({ user }) => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post, processing, transform } = useForm({
    unique_code: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    data.unique_code = data.unique_code.replace(/\s/g, '');

    post('/challenge/search', {
      onError: (err) => {
        setFormErrors(transformErrors(err));
      },
      only: ['errors'],
    });
  };
  return (
    <AuthenticatedLayout
      user={user}
      title="Enter Challenge Code"
      description="Enter a challenge code to join a matchup."
    >
      <div className="container mx-auto mt-8 px-5">
        <Card className="max-w-2xl mx-auto">
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="unique_code" value="Unique Code" />
              </div>
              <TextInput
                id="unique_code"
                type="text"
                placeholder="XXXX YYYY ZZZZ"
                value={data.unique_code}
                onChange={(e) =>
                  setData(
                    'unique_code',
                    formatUniqueCodeWhileTyping(e) as string
                  )
                }
                required
                color={formErrors?.errors.unique_code ? 'failure' : 'gray'}
                helperText={formErrors?.errors.unique_code ?? ''}
              />
            </div>

            <Button
              id="searchDiscoverableChallenge"
              type="submit"
              disabled={processing}
              isProcessing={processing}
              className="w-full"
              color="blue"
            >
              Next
            </Button>
          </form>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
};

export default Search;
