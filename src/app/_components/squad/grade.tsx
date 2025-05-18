"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
// import React, { useRef } from "react";
import { api } from "../../../trpc/react";
import React, { useEffect, useRef, useState } from "react";

export function Grade({
  taskId,
  studentId,
}: {
  taskId: string;
  studentId: string;
}) {
  const valRef = useRef<HTMLInputElement>(null);
  const grades = api.grade.getByTask.useQuery({ taskId });
  const set = api.grade.create.useMutation();
  console.log(grades.data);
  const [lastGrade, setLastGrade] = useState<number | null>(null); // Измените на null

  useEffect(() => {
    const studentGrade = grades.data?.find(grade => grade.studentId === studentId);
    if (studentGrade) {
      setLastGrade(studentGrade.value);
    } 
  }, [grades.data, studentId]);
  // const onSetHandler = () => {
  //   set.mutate({ taskId, studentId, value: Number(valRef.current?.value) });
  // };
  const onSetHandler = () => {
    set.mutate({
      taskId, studentId, value: Number(valRef.current?.value),
      squadTutorId: ""
    });
  };
  return (
    <>
      <input
        ref={valRef}
        type="number"
        name="value"
        value={lastGrade !== null ? lastGrade : ''} // Отображаем значение или пустую строку
        onChange={(e) => setLastGrade(Number(e.target.value))}
        // defaultValue={0}
        className="w-8 px-px"
      />
      <button type="submit" onClick={onSetHandler}>
        <CheckIcon className="w-6" />
      </button>
    </>
  );
}