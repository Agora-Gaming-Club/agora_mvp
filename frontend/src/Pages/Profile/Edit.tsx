import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from 'flowbite-react';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import { UserProfile } from '@/schema';

type Props = {
  user: UserProfile;
};
const Edit: FunctionComponent<Props> = ({ user }) => {
  console.log(user);
  return (
    <AuthenticatedLayout user={user} title="Profile Information">
      <div className="py-8 px-4 mt-5">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <Card className="p-4 sm:p-8">
            <UpdateProfileInformationForm user={user} className="max-w-xl" />
          </Card>

          <Card className="p-4 sm:p-8">
            <DeleteUserForm className="max-w-xl" />
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Edit;
