import { useLanguage } from "@/lib/i18n";
import { z } from "zod";

export const prpfileSchema = () => {
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
  });
};