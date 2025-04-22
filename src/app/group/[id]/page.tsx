import React, { Suspense } from "react";
import { AdminComponentGroup } from "~/app/_components/admin";
import GroupUser from "~/app/_components/group/groupUser";
import { UserComponentGroup } from "~/app/_components/user";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function Page(props: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ query?: string}> 
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const params = await props.params;
  const group  = await db.group.findUnique({ where: { id: params.id } });


  if (!group)
    return (
      <main>
        <h1>User not found</h1>
      </main>
    );
    const role = (await auth())?.user.role;

  if (role === "ADMIN")
    return <AdminComponentGroup group={group} query={query} />;

  return <UserComponentGroup group={group} />;
}
