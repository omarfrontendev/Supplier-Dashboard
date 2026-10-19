import { useLanguage } from "@/lib/i18n";
import { z } from "zod";

export const hotelSchema = () => {
  const { c } = useLanguage();

  return z
    .object({
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

      checkInTime: z
        .string()
        .min(1, { message: c.common.fieldRequired })
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
          message: c.common.invalidTime,
        }),

      checkOutTime: z
        .string()
        .min(1, { message: c.common.fieldRequired })
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
          message: c.common.invalidTime,
        }),

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

      area: z.string().trim().min(1, { message: c.common.fieldRequired }),

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

      latitude: z.number().min(-90).max(90),

      longitude: z.number().min(-180).max(180),

      starRating: z.number().int().min(1).max(5),

      descriptionEn: z
        .string()
        .trim()
        .min(1, { message: c.common.fieldRequired })
        .refine((val) => !/[\u0600-\u06FF]/.test(val), {
          message: c.common.arabicLettersNotAllowed,
        }),

      descriptionAr: z
        .string()
        .trim()
        .min(1, { message: c.common.fieldRequired })
        .refine((val) => !/[A-Za-z]/.test(val), {
          message: c.common.englishLettersNotAllowed,
        }),

      policies: z.object({
        en: z.string().trim().min(1, {
          message: c.common.fieldRequired,
        }),
        ar: z.string().trim().min(1, {
          message: c.common.fieldRequired,
        }),
      }),

      contact: z.object({
        phone: z.string().trim().min(1, { message: c.common.fieldRequired }),

        email: z
          .string()
          .trim()
          .min(1, { message: c.common.fieldRequired })
          .email({ message: c.common.fieldRequired }),

        website: z.string().trim().min(1, { message: c.common.fieldRequired }),
      }),

      amenities: z.array(
        z.object({
          amenityId: z.number().int().positive(),
          value: z.boolean(),
        }),
      ),
    })
    .superRefine((data, ctx) => {
      console.log(data);

      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

      if (!timeRegex.test(data.checkInTime) || !timeRegex.test(data.checkOutTime)) {
        return;
      }

      const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const checkIn = toMinutes(data.checkInTime);
      const checkOut = toMinutes(data.checkOutTime);

      if (checkOut < checkIn) {
        ctx.addIssue({
          code: "custom",
          path: ["checkOutTime"],
          message: c.common.checkOutMustBeAfterCheckIn,
        });
      }
    });
};

export type PropertyFormValues = z.infer<ReturnType<typeof hotelSchema>>;
