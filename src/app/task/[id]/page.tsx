import Link from "next/link";
import React from "react";
import {
  addUserTask,
  deleteTask,
  deleteUserTask,
  updateTask,
} from "../../api/action/task";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { AdminComponentTask } from "~/app/_components/admin";
import { UserComponentTask } from "~/app/_components/user";


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const task = await db.task.findUnique({
    where: { id: params.id },
    include: { squades: true },
  });
  const taskType = await db.taskType.findUnique({
    where: { id: task?.taskTypeId },
  });

  if (!task)
    return (
      <main>
        <h1>Task not found</h1>
      </main>
    );
    const role = (await auth())?.user.role;
    const mode = role === "ADMIN" || role === "TUTOR";
  
 
  if (mode) {
    return <AdminComponentTask task={task} taskType={taskType} />;
  }

  return <UserComponentTask task={task} taskType={taskType} />;

}
