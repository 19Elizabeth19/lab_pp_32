import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

// import { Navbar } from "./..//_components/navbar";
// import { SigninLink } from "./..//_components/signlink";
import { db } from "~/server/db";
import { AddUser } from "../_components/user/addUser";

export default async function Home() {
  const users = await db.user.findMany();

  return (
    <>
      <h1>User page</h1>
      <AddUser />
      {users.map((user) => <div key={user.id}>{user.email}</div>)}
    </>
  )

}
