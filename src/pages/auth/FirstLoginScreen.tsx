import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { changePasswordSchema, type ChangePasswordFormValues } from './change-password.schema';
import { changePasswordFields } from './changePasswordFields';
import FormField from '@/components/ui/FormField';
import { useEffect } from 'react';
import { useFirstLogin } from './useFirstLogin';

export const FirstLoginScreen = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/auth/login', { replace: true });
    }
  }, [token, navigate]);


  const { mutate: firstLogin, isPending } =
    useFirstLogin();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'all',
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    if (!token) return;

    firstLogin(
      {
        token,
        password: values.newPassword,
        confirmPassword: values.confirmNewPassword,
      },
      {
        onSuccess: () => {
          navigate('/auth/login', { replace: true });
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create New Password
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new password for your account.
          </p>

          {/* {email && (
            <p className="mt-3 text-sm text-gray-600">
              {email}
            </p>
          )} */}
        </div>

        <Form {...form}>
          <form
            id="change-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="block w-full space-y-6"
          >
            <div className="grid w-full grid-cols-12 gap-4">
              {changePasswordFields().map((field: any) => (
                <FormField
                  key={field.name}
                  form={form}
                  {...field}
                />
              ))}
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Password requirements
              </p>

              <ul className="space-y-1 text-xs text-gray-500">
                <li>• At least 8 characters</li>
                <li>• At least one uppercase letter</li>
                <li>• At least one lowercase letter</li>
                <li>• At least one number</li>
                <li>• At least one special character</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isPending || !token}
              className="h-12 w-full"
            >
              {isPending
                ? 'Saving Password...'
                : 'Save Password'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};