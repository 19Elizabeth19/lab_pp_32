import React from "react";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteTutor } from "~/app/api/action/squad";
import TutorSearch from "../../ui/tutorSearch";
import { db } from "~/server/db";
import { Students } from "~/app/_components/squad/students";
import { api } from "~/trpc/server";
import { groupEnd } from "console";
import { auth } from "~/server/auth";
import UserComponentSquad from "~/app/_components/user";
import AdminComponentSquad from "~/app/_components/admin";


export default async function Page(props: {
  params: Promise<{ id: string  }>;
  searchParams: Promise<{
    query?: string;
    student?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";  
  const params = await props.params;
  const squad = await db.squad.findUnique({
    where: { id: params.id },
    include: {       
      task: true, 
      tutor: true,
      StudentsOnTasks: {
        include: {
          student: true
        }
      } },
  })
  const task = squad?.task
  const tutor = squad?.tutor  
  const session = await auth();
  const role = session?.user.role;
  const mode = role === "ADMIN" || (squad?.tutorId === session?.user.id);
  // const gr = await api.post.hello({ text: "server world" });
  // console.log("\n\nTRPC\n\n", gr);
 
  if(mode) return (
      <AdminComponentSquad
        task={task || null}
        tutor={tutor || null}
        squadId={squad?.id ?? ""}
        query={query}
      />
    // <main>
    //   <Link href={`/task/${task?.id}`} className="btn btn-primary">
    //     {task?.name}
    //   </Link>
    //   <div>
    //     <table className="m-4 box-border">
    //       <tbody>
    //         <tr>
    //           <td>Преподаватель:</td>
    //           <td>
    //             {tutor ? tutor.firstname + " " + tutor.surname : "Не назначен"}
    //           </td>
    //           <td>
    //             <form action={deleteTutor} className="form-control">
    //               <input type="hidden" name="squadId" defaultValue={squad?.id} />
    //               <button type="submit">
    //                 <UserMinusIcon className="w-6" />
    //               </button>
    //             </form>
    //           </td>
    //         </tr>
    //       </tbody>
    //     </table>
    //     <TutorSearch
    //       query={query}
    //       squadId={squad?.id ?? ""}          
    //     />
    //   </div>
    //   <Students squadId={squad?.id ?? ""} taskId={task?.id ?? ""}/>
    // </main>
  );
  return (
    <UserComponentSquad
      task={task || undefined} 
      tutor={tutor || undefined} 
      squadId={squad?.id ?? ""}
      taskId={task?.id ?? ""}
      mode={false}
    />
  );
  // return (
  //   <main>
  //     <Link href={`/task/${task?.id}`} className="btn btn-primary">
  //       {task?.name}
  //     </Link>
  //     <div>
  //       <table className="m-4 box-border">
  //         <tbody>
  //           <tr>
  //             <td>Преподаватель:</td>
  //             <td>
  //               {tutor ? tutor.firstname + " " + tutor.surname : "Не назначен"}
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>
  //     <Students squadId={squad?.id ?? ""} taskId={task?.id ?? ""} mode={false}/>
  //   </main>
  // );
}