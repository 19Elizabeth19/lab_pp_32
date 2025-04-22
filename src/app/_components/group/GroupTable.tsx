"use client";
import React, { useEffect } from "react";
import { CheckIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Group } from "@prisma/client";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function GroupTable({
  page,
  size,
}: {
  page?: number;
  size?: number;
}) {
  const [groupNames, setGroupsNames] = React.useState<string[]>([]);
  const url = `/api/group?size=${size || 3}&page=${page || 1}`;
  const queryClient = useQueryClient();
  
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groups", page, size],
    queryFn: async () => {
      const groups = await fetch(url).then((res) => res.json());
      return groups;
    },
  });

  const putMutation = useMutation({
    mutationFn: async (group: Group) => {
      const response = await fetch(`/api/group/${group.id}`, {
        method: "PUT",
        body: JSON.stringify(group),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    },
    onSuccess: (updatedGroup) => {
      setGroupsNames((prev) => {
        const index = prev.findIndex((name, i) => i === updatedGroup.id);
        if (index !== -1) {
          const newNames = [...prev];
          newNames[index] = updatedGroup.name; 
          return newNames;
        }
        return prev;
        
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/group/${id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] }); 
    },
  });

  useEffect(() => {
    if (data) {
      const sortedGroups = data.sort((a: Group, b: Group) => parseInt(a.id) - parseInt(b.id));
      setGroupsNames(sortedGroups.map((u: Group) => u.name)); 
    }
  }, [data]);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Ошибка: {error.message}</span>;
  }

  const groups: Group[] = data || [];

  function handleChangeName(id: string, index: number) {
    putMutation.mutate({ id, name: groupNames[index] ?? "" });
  }

  function handleEditGroup(index: number, name: string) {
    setGroupsNames((prev: string[]) => [
      ...prev.slice(0, index),
      name,
      ...prev.slice(index + 1),
    ]);
  }

  function handleDeleteGroup(id: string) {
    deleteMutation.mutate(id);
  }
  //инвалидировать квери когда выполняется удаление 

  return (
      <>
        <table className="m-4 box-border">
          <thead>
            <tr>
              <th>Название</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((u, index) => (
              <tr key={u.id}>
                <td className="px-2">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder={"Имя группы"}
                    onChange={(e) => {
                      handleEditGroup(index, e.target.value);
                    }}
                    value={groupNames[index] || ""}
                  />
                </td>
                <td className="px-2">
                  <button onClick={() => handleChangeName(u.id, index)}>
                    <CheckIcon className="w-6" />
                  </button>
                </td>
                <td className="px-2">
                  <Link href={`/group/${u.id}`}>
                    <PencilSquareIcon className="w-4" />
                  </Link>
                </td>
                <td className="px-2">
                  <button
                    onClick={() => handleDeleteGroup(u.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  >
                    Удалить
                  </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
}
