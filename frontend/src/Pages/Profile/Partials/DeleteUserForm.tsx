import { FormEventHandler, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function DeleteUserForm({
  className = '',
}: {
  className?: string;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>();

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm({
    password: '',
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy('/', {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h1 className="text-white">Delete Account</h1>
        <h3 className="text-gray-500">
          Contact the agora admin to have your account & data removed.
        </h3>
      </header>

      {/*<Button color="failure" onClick={confirmUserDeletion}>*/}
      {/*  Delete Account*/}
      {/*</Button>*/}

      {/*<Modal show={confirmingUserDeletion} onClose={closeModal}>*/}
      {/*  <form onSubmit={deleteUser} className="p-6">*/}
      {/*    <h1 className="text-lg font-medium">*/}
      {/*      Are you sure you want to delete your account?*/}
      {/*    </h1>*/}

      {/*    <p className="mt-1 text-sm">*/}
      {/*      Once your account is deleted, all of its resources and data will be*/}
      {/*      permanently deleted. Please enter your password to confirm you would*/}
      {/*      like to permanently delete your account.*/}
      {/*    </p>*/}

      {/*    <div className="mt-6">*/}
      {/*      <TextInput*/}
      {/*        id="password"*/}
      {/*        type="password"*/}
      {/*        name="password"*/}
      {/*        value={data.password}*/}
      {/*        onChange={(e) => setData('password', e.target.value)}*/}
      {/*        className="mt-1 w-full"*/}
      {/*        placeholder="Password"*/}
      {/*      />*/}

      {/*      /!*<InputError message={errors.password} className='mt-2' />*!/*/}
      {/*    </div>*/}

      {/*    <div className="mt-6 flex justify-end">*/}
      {/*      <Button onClick={closeModal}>Cancel</Button>*/}

      {/*      <Button color="failure" className="ms-3" disabled={processing}>*/}
      {/*        Delete Account*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </form>*/}
      {/*</Modal>*/}
    </section>
  );
}
