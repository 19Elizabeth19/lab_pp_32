"use client";

import React from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";

export function AddGroup() {
    const addGroupMutation = useMutation({
        mutationFn: async (name: string) => {
            const response = await fetch('/api/group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) {
                throw new Error("ffff");
            }
            return response.json();
        },
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        addGroupMutation.mutate(name);
    };

    return (
        <details className="collapse bg-base-100" tabIndex={0}>
            <summary className="collapse-title text-xl font-medium">
                <FolderPlusIcon className="w-6" />
            </summary>
            <form onSubmit={handleSubmit} className="collapse-content form-control">
                <div className="flex flex-col max-w-xs space-y-2">
                    <label>Название</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="input input-bordered"
                        disabled={addGroupMutation.isPending} // Используем isPending вместо isLoading
                    />
                    <button
                        type="submit"
                        className={`btn btn-primary ${addGroupMutation.isPending ? 'loading' : ''}`} // Используем isPending вместо isLoading
                        disabled={addGroupMutation.isPending} // Используем isPending вместо isLoading
                    >
                        Добавить
                    </button>
                </div>
            </form>
        </details>
    );
}

