import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Profile: FunctionComponent = () => {
  return (
    <AuthenticatedLayout>
      <h1 className="text-white text-3xl">profile</h1>
    </AuthenticatedLayout>
  );
};

export default Profile;
