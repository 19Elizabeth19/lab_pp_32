"use server";

import { $Enums } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  export async function deleteUser(formData: FormData) {
    const fd = z
      .object({
        id: z.string(),
      })
      .parse({
        id: formData.get("id"),
      });
    await db.user.delete({ where: { id: fd.id } });
    redirect("/user");
  }

  export async function updateUser(formData: FormData) {
    const fd = z
      .object({
        id: z.string(),      
        firstname: z.string(),
        surname: z.string(),
        role: z.nativeEnum($Enums.Role),
      })
      .parse({
        id: formData.get("id"),      
        firstname: formData.get("firstname"),
        surname: formData.get("surname"),
        role: formData.get("role"),
      });
    await db.user.update({ where: { id: fd.id }, data: fd });
    revalidatePath("/user/"+fd.id);
  }

  // export async function deleteUserfromGroup(formData: FormData) {
  //   const fd = z
  //     .object({
  //       id_student: z.string(),
  //       id_group: z.string(),
  //     })
  //     .parse({
  //       id_student: formData.get("id_student"),
  //       id_group: formData.get("id_group"),
  //     });
  //   await db.group.update({
  //     where: { id: fd.id_group },
  //     data: {
  //       User: {
  //         disconnect: { id: fd.id_student },
  //       },
  //     },
  //   }); 
  //   revalidatePath("/group/" + fd.id_group); 
  // }