import 'server-only'
import { z } from 'zod'

const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).default('+Propre <devis@plus-propre.fr>'),
  QUOTE_NOTIFICATION_TO: z.email().default('contact@plus-propre.fr'),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  INDEXNOW_KEY: z.string().min(8).optional(),
})

export const serverEnv = serverSchema.parse({
  SUPABASE_SECRET_KEY:
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  EMAIL_FROM: process.env.EMAIL_FROM || undefined,
  QUOTE_NOTIFICATION_TO: process.env.QUOTE_NOTIFICATION_TO || undefined,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || undefined,
  INDEXNOW_KEY: process.env.INDEXNOW_KEY || undefined,
})
