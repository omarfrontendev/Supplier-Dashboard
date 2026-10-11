import { useLanguage } from "@/lib/i18n";
import { z } from "zod";

export const roomSchema =  () => {

  const {c} = useLanguage()

  return (
    z.object({
     hotelId: z.number().int().positive("Hotel is required"),
   
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
   
     maxOccupancy: z.number().int().positive("Maximum occupancy must be greater than 0"),
   
     adults: z.number().int().min(1, "At least one adult is required"),
   
     children: z.number().int().min(0, "Children cannot be negative"),
   
     maxChildAge: z.number().int().min(0, "Maximum child age cannot be negative"),
   
     bedTypeId: z.number().int().positive("Bed type is required"),
   
     roomSizeId: z.number().int().positive("Room size is required"),
   
     areaSqm: z.number().positive("Room area must be greater than 0"),
   
     view: z.string().trim().min(1, "Room view is required"),
   
    //  images: z
    //    .array(
    //      z.object({
    //        uploadId: z.number().int().positive(),
    //        isCover: z.boolean(),
    //        captionEn: z.string(),
    //        captionAr: z.string(),
    //        sortOrder: z.number().int().min(0),
    //      }),
    //    )
    //    .min(1, "At least one room image is required"),
   
     note: z.string().optional(),
   })
  )
}

export type RoomFormValues = z.infer<typeof roomSchema>;
