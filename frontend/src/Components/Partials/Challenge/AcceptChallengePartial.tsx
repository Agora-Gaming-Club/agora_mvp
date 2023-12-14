import * as React from 'react';
import { FormEventHandler, FunctionComponent, useState } from 'react';
import { TransformedErrors, transformErrors } from '@/Utils/form';
import { useForm } from '@inertiajs/react';
import Cookies from 'js-cookie';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { UserProfile, Wager } from '@/schema';
import ChallengeDescription from '@/Components/ChallengeDescription';

type Props = {
  challenge: Wager;
  user: UserProfile;
};

const AcceptChallengePartial: FunctionComponent<Props> = ({
  challenge,
  user,
}) => {
  const [formErrors, setFormErrors] = useState<TransformedErrors | null>(null);
  const { data, setData, post } = useForm({
    respondent_gamer_tag: '',
    csrfmiddelwaretoken: Cookies.get('XSRF-TOKEN'),
    accept: true,
  });
  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(`/challenge/${challenge.unique_code}`, {
      onError: (err) => {
        console.log(err);
        setFormErrors(transformErrors(err));
      },
      onSuccess: () => location.reload(),
      only: ['errors', 'challenge'],
    });
  };

  return (
    <Card className="max-w-xl text-center mx-auto p-1 sm:p-5">
      <ChallengeDescription challenge={challenge} />

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="gamerTag" value="Gamer Tag" />

          <TextInput
            id="gamerTag"
            value={data.respondent_gamer_tag}
            onChange={(e) => setData('respondent_gamer_tag', e.target.value)}
            type="text"
            className="mt-1 w-full"
            placeholder="Enter your Gamer Tag"
            required
            color={formErrors?.errors.respondent_gamer_tag ? 'failure' : 'gray'}
            helperText={formErrors?.errors.respondent_gamer_tag ?? ''}
          />
        </div>

        <div>
          <Button id="acceptChallenge" className="w-full" type="submit" color="blue">
            Accept Challenge
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AcceptChallengePartial;
