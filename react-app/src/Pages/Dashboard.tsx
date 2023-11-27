import { FunctionComponent } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from 'flowbite-react';

const Dashboard: FunctionComponent = () => {
  return (
    <AuthenticatedLayout>
      <Card>
        <h1 className="text-4xl text-white font-extrabold tracking-tight">
          $500
        </h1>
        <h2>Total Winnings</h2>
      </Card>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
