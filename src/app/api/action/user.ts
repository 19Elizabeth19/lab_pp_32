"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "~/server/db";

export async function createUser(formData: FormData) {
    const fd = z
      .object({
        email: z.string().email(),
        firstname: z.string(),
        surname: z.string(),
      })
      .parse({
        email: formData.get("email"),
        firstname: formData.get("firstname"),
        surname: formData.get("surname"),
      });
    await db.user.create({ data: fd });
    revalidatePath("/user");
  }