import React, { Suspense } from "react";
import Link from "next/link";
import GroupUser from "~/app/_components/group/groupUser";
import { TaskTable } from "./task/table";


export function UserComponentGroup({ group }: { group: { id: string; name: string } }) {
    return (
      <main>
        <h1>Группа</h1>
        <h2>{group.name}</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <GroupUser group={group} />
        </Suspense>
      </main>
    );
}

export function UserComponentTask({ task, taskType }: { task: any; taskType: any }) {
  return (
    <main>
      <Link href={`/taskType/${task.taskTypeId}`} className="btn btn-primary">
        {taskType?.name}
      </Link>
      <h1>{task.name}</h1>
      <table className="m-4 box-border">
        <tbody>
          {task.squades.map((squad: any, index: number) => (
            <tr key={squad.id}>
              <td>
                <Link href={`/squad/${squad.id}`} className="btn btn-primary">
                  {"Поток " + (index + 1)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export function UserComponentTaskType({ taskType, tasks }: { taskType: any; tasks: any[] }) {
  return (
    <main>
      <h1>{taskType.name}</h1>
      <TaskTable tasks={tasks} />
    </main>
  );
}

export function UserComponentDetails({ user }: { user: any }) {
  const groupJSX = user?.group && (
    <>
      <p>Группа: <Link href={"/group/" + user?.group.id}>{user?.group.name + "-" + user.subgroup}</Link></p>
    </>
  );

  return (
    <main>
      <h1>Данные пользователя</h1>
      <p>Электронная почта: {user.email}</p>
      <p>Имя: {user.firstname}</p>
      <p>Фамилия: {user.surname}</p>
      <p>Роль: {user.role}</p>
      {groupJSX}
    </main>
  );
}
