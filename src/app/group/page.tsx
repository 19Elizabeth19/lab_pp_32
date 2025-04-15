import React,  { Suspense } from "react";
import { db } from "~/server/db";
import Pagination from "../ui/pagination";
import GroupTable from "../_components/group/GroupTable";
import { AddUser } from "../_components/user/addUser";
import { AddGroup } from "../_components/group/addGroup";
import { auth } from "~/server/auth";


export default async function Page(props: {
  searchParams?: Promise<{
    size?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const size = Number(searchParams?.size) || 3;

  const count = await db.group.count();
  // const groups = await db.group.findMany({
  //   skip: (page - 1) * size,
  //   take: size,
  // });

  const pages = Math.ceil(Number(count) / size);
  const role = (await auth())?.user.role;
  return (
    <div>
      <h1> group page </h1>
      {/* {role === "ADMIN" && <AddGroup />} */}
      {<AddGroup />}
      {/* <GroupTable groups={groups} /> */}
      <GroupTable page={page} size={size} />
      <Pagination totalPages={pages} />
    </div>
  );
}
