import { z } from "zod";
import { CATEGORIES, CITIES } from "../needs/constants";

const phoneDigitsOnly = (s: string) => s.replace(/[^\d]/g, "");

export const createNeedSchema = z.object({
  title: z.string().trim().min(3).max(80),
  description: z.string().trim().min(10).max(2000),
  city: z.enum(CITIES),
  category: z.enum(CATEGORIES),
  whatsapp: z
    .string()
    .trim()
    .transform(phoneDigitsOnly)
    .refine(async (v) => v.length >= 8, "Numéro WhatsApp invalide")
    .refine(async (v) => v.length <= 25, "Numéro WhatsApp trop long (max 25 chiffres)"),
});

