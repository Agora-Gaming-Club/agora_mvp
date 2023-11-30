import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from 'flowbite-react';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';

type Props = {
  user: UserProfile;
};
const ChangePassword: FunctionComponent<Props> = ({ user }) => {
  return (
    <AuthenticatedLayout user={user} title="Update Password">
      <div className="py-8 px-4 mt-5">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <Card className="p-4 sm:p-8">
            <UpdatePasswordForm className="max-w-xl" />
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ChangePassword;
