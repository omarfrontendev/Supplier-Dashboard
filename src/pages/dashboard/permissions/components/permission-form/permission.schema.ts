import { z } from 'zod';

export const getPermissionSchema = () => {
    return z
        .object({
            nameEn: z
                .string()
                .trim()
                .nonempty({ message: 'nameRequired' })
                .refine((val) => !/[\u0600-\u06FF]/.test(val), {
                    message: 'arabicLettersNotAllowed',
                }),
            nameAr: z
                .string()
                .trim()
                .nonempty({ message: 'nameRequired' })
                .refine((val) => !/[A-Za-z]/.test(val), {
                    message: 'englishLettersNotAllowed',
                }),
            // descriptionEn: z
            //     .string()
            //     .trim()
            //     // .nonempty({ message: 'descriptionRequired' })
            //     .refine((val) => !/[\u0600-\u06FF]/.test(val), {
            //         message: 'arabicLettersNotAllowed',
            //     }),
            // descriptionAr: z
            //     .string()
            //     .trim()
            //     // .nonempty({ message: 'descriptionRequired' })
            //     .refine((val) => !/[A-Za-z]/.test(val), {
            //         message: 'englishLettersNotAllowed',
            //     }),
            permissionKeys: z
                .array(z.string(), {message: "You need to select at least one permission"})
                .min(1, {message: "You need to select at least one permission"})
        })
};
