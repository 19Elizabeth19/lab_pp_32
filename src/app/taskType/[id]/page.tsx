import React from "react";
import { AdminComponentTaskType } from "~/app/_components/admin";
import { AddTask } from "~/app/_components/task/add";
import { TaskTable } from "~/app/_components/task/table";
import { UserComponentTaskType } from "~/app/_components/user";
import { deleteTaskType, updateTaskType } from "~/app/api/action/taskType";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export default async function Page(props: { 
  params: Promise<{ id: string }>,
}) {
  const params = await props.params;
  const taskType = await db.taskType.findUnique({ where: { id: params.id } });
  const tasks = await db.task.findMany({ where: { taskTypeId: taskType?.id } });

  if (!taskType)
    return (
      <main>
        <h1>Task group not found</h1>
      </main>
    );

  const role = (await auth())?.user.role;
  const mode = role === "ADMIN" || role === "TUTOR";


  if (mode) {
    return <AdminComponentTaskType taskType={taskType} tasks={tasks} />;
  }

  return <UserComponentTaskType taskType={taskType} tasks={tasks} />;

}