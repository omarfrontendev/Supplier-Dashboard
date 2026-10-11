import { useLanguage } from "@/lib/i18n";
import { z } from "zod";

export const hotelSchema = () => {
  const { c } = useLanguage();

  return z.object({
    nameEn: z
      .string()
      .trim()
      .nonempty({ message: c.common.fieldRequired })
      .refine((val) => !/[\u0600-\u06FF]/.test(val), {
        message: c.common.arabicLettersNotAllowed,
      }),

    nameAr: z
      .string()
      .trim()
      .nonempty({ message: c.common.fieldRequired })
      .refine((val) => !/[A-Za-z]/.test(val), {
        message: c.common.englishLettersNotAllowed,
      }),

    // aliases: z.array(z.string().trim()),

    // propertyType: z.enum(["hotel"]),

    // brand: z.string().trim(),
    // chain: z.string().trim(),

    countryCode: z
      .string()
      .trim()
      .length(2, { message: c.common.fieldRequired })
      .regex(/^[A-Za-z]{2}$/, {
        message: c.common.fieldRequired,
      }),

    city: z.string().trim().nonempty({
      message: c.common.fieldRequired,
    }),

    area: z.string().trim(),

    addressEn: z
      .string()
      .trim()
      .nonempty({ message: c.common.fieldRequired })
      .refine((val) => !/[\u0600-\u06FF]/.test(val), {
        message: c.common.arabicLettersNotAllowed,
      }),

    addressAr: z
      .string()
      .trim()
      .nonempty({ message: c.common.fieldRequired })
      .refine((val) => !/[A-Za-z]/.test(val), {
        message: c.common.englishLettersNotAllowed,
      }),

    // postalCode: z.string().trim(),

    latitude: z.number().min(-90).max(90),

    longitude: z.number().min(-180).max(180),

    // timezone: z.string().trim().nonempty({
    //   message: c.common.fieldRequired,
    // }),

    starRating: z.number().int().min(1).max(5),

    descriptionEn: z
      .string()
      .trim()
      .refine((val) => !/[\u0600-\u06FF]/.test(val), {
        message: c.common.arabicLettersNotAllowed,
      }),

    descriptionAr: z
      .string()
      .trim()
      .refine((val) => !/[A-Za-z]/.test(val), {
        message: c.common.englishLettersNotAllowed,
      }),
      
    // checkInTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
    //   message: c.common.fieldRequired,
    // }),

    // checkOutTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
    //   message: c.common.fieldRequired,
    // }),

    // policies: z.object({
    //   en: z.string().trim(),
    //   ar: z.string().trim(),
    // }),

    // contact: z.object({
    //   phone: z.string().trim(),

    //   email: z.string().trim().email().or(z.literal("")),

    //   website: z.string().trim(),
    // }),

    amenities: z.array(
      z.object({
        amenityId: z.number().int().positive(),
        value: z.boolean(),
      }),
    ),

    // images: z.array(
    //   z.object({
    //     uploadId: z.number().int().positive(),

    //     captionEn: z
    //       .string()
    //       .trim()
    //       .refine((val) => !/[\u0600-\u06FF]/.test(val), {
    //         message: c.common.arabicLettersNotAllowed,
    //       }),

    //     captionAr: z
    //       .string()
    //       .trim()
    //       .refine((val) => !/[A-Za-z]/.test(val), {
    //         message: c.common.englishLettersNotAllowed,
    //       }),

    //     sortOrder: z.number().int().min(0),

    //     isCover: z.boolean(),
    //   }),
    // ),

    // note: z.string().trim(),
  });
};

export type PropertyFormValues = z.infer<ReturnType<typeof propertySchema>>;
