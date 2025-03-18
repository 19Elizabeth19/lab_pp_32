import React from "react";
import { db } from "~/server/db";
import Pagination from "../ui/pagination";
import GroupTable from "../_components/group/GroupTable";
import { AddUser } from "../_components/user/addUser";
import { AddGroup } from "../_components/group/addGroup";

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
  const groups = await db.group.findMany({
    skip: (page - 1) * size,
    take: size,
  });

  const pages = Math.ceil(Number(count) / size);

  return (
    <div>
      <h1> group page </h1>
      <AddGroup />
      <GroupTable groups={groups} />
      <Pagination totalPages={pages} />
    </div>
  );
}
