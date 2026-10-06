import { useLanguage } from "@/lib/i18n";
import { z } from "zod";

export const memberSchema = () => {
  const { c } = useLanguage();

  return z.object({
    email: z
      .string()
      .trim()
      .nonempty({ message: c.common.fieldRequired })
      .email({ message: c.common.invalidEmail }),

    username: z.string().trim().nonempty({ message: c.common.fieldRequired }),
    role: z.string().nonempty({ message: c.common.fieldRequired }),

    phoneNumber: z.string().trim().nonempty({ message: c.common.fieldRequired }),
    // permissionProfileIds: z.number().nullable(),
    // permissionProfileIds: z.array(z.number()).min(1),
    permissionProfileIds: z.array(z.number()).min(1, c.common.fieldRequired),
  });
};
