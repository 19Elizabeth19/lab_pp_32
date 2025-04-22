"use client"
import React, { useState } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function AddGroup() {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: async (group: { name: string }) => {
      const response = await fetch(`/api/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(group),
      });
      return response.json();
    },
    onSuccess: () => {
      setName(""); 
      queryClient.invalidateQueries({ queryKey: ["groups"] }); 

    },
  });

  const addGroup = (e: React.FormEvent) => {
    e.preventDefault(); 
    postMutation.mutate({ name }); 
  };

  return (
    <details className="collapse bg-base-100" tabIndex={0}>
      <summary className="collapse-title text-xl font-medium">
        <FolderPlusIcon className="w-6" />
      </summary>
      <form onSubmit={addGroup} className="collapse-content form-control">
        <div className="flex flex-col max-w-xs space-y-2">
          <label>Название</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required
            className="input input-bordered"
          />
          <button type="submit" className="btn btn-primary">
            Добавить
          </button>
        </div>
      </form>
    </details>
  );
}