import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useChangePassword } from './useChangePassword';
import { changePasswordSchema, type ChangePasswordFormValues } from './change-password.schema';
import { changePasswordFields } from './changePasswordFields';
import FormField from '@/components/ui/FormField';
import { useEffect } from 'react';

export const ChangePasswordPage = () => {
  const [searchParams] = useSearchParams();

  const resetToken = searchParams.get('resetToken') ?? '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!resetToken) {
      navigate('/auth/login', { replace: true });
    }
  }, [resetToken, navigate]);


  const { mutate: changePassword, isPending } =
    useChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'all',
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    if (!resetToken) return;

    changePassword(
      {
        resetToken,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
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
            Change Password
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
              disabled={isPending || !resetToken}
              className="h-12 w-full"
            >
              {isPending
                ? 'Changing Password...'
                : 'Change Password'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};