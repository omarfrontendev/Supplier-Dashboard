import { z } from 'zod';

export const getUserSchema = () => {

    return z
        .object({
            email: z.string()
                .trim()
                .nonempty({ message: 'emailRequired' })
                .email({ message: 'invalidEmail' }),

            username: z
                .string()
                .trim()
                .nonempty({ message: 'username' }),
            role: z
                .string()
                .nonempty({ message: 'roleRequired' }),

            phoneNumber: z
                .string()
                .trim()
                .nonempty({ message: 'phoneRequired' }),
            permissionProfileIds: z.number().nullable(),
            // permissionProfileIds: z.array(z.number()).min(1),
        })
};
