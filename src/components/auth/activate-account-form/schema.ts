import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .regex(
          /[A-Z]/,
        'Password must contain at least one uppercase letter.'
      )
      .regex(
          /[a-z]/,
        'Password must contain at least one lowercase letter.'
      )
      .regex(
          /[0-9]/,
          'Password must contain at least one number.'
        )
        .regex(
            /[^A-Za-z0-9]/,
            'Password must contain at least one special character.'
        )
        .min(8, 'Password must contain at least 8 characters.'),

    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordFormValues = z.infer<
  typeof changePasswordSchema
>;