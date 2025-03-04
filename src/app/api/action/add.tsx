"use server";
import { db } from "~/server/db";

export async function add(email:string| undefined) {
    db.user.create ({data:{email: email}}) 
}