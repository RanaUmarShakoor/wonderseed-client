import { useQuery } from "@tanstack/react-query";
import { apiConn, useGetPrograms } from "apiconn";
import cx from "classnames";
import { Link } from "react-router-dom";
import { useCurrentUser } from "utils";

function ProgramTile({ program }: { program: any }) {
  let statusClass = "";
  let statusText = "";
  if (program.status === "published") {
    statusClass = "border-blue-300 bg-blue-100 text-blue-700";
    statusText = "Published";
  } else {
    statusClass = "border-amber-300 bg-amber-100 text-amber-700";
    statusText = "Draft";
  }

  return (
    <div className='flex items-start bg-white px-4 py-4'>
      <div className='flex-1'>
        <h2 className='mb-1 text-xl font-bold'>{program.name}</h2>
        <span
          className={cx(
            "rounded-full border px-3 py-1 text-[0.8rem] leading-none",
            statusClass
          )}
        >
          {statusText}
        </span>
        <div className='mt-3 grid grid-cols-[auto_auto] grid-rows-2 place-content-start gap-x-8 gap-y-2'>
          <span>
            <strong>Modules:</strong> {program.modules.length}
          </span>
          {/*
          <span>
            <strong>Duration:</strong> 120min
          </span>
          */}
          <span>
            <strong>Active Cohorts:</strong>{" "}
            {program.cohorts.filter((p: any) => p.status === "active").length}{" "}
          </span>
          <span>
            <strong>Active Students:</strong>{" "}
            {program.cohorts
              .map((ch: any) => ch.students.length)
              .reduce((a: number, b: number) => a + b, 0)}
          </span>
        </div>
      </div>
      <Link to={`program/${program.id}`} className='w-button shrink-0'>
        Manage
      </Link>
    </div>
  );
}

export function ProgramListView() {
  const { currentUser, isSuperAdmin } = useCurrentUser();

  let { data: programs } = useGetPrograms({
    keepPreviousData: true,
    initialData: []
  });

  if (!isSuperAdmin) {
    programs = programs.filter(p => p.id === currentUser?.program?.id);
  }

  return (
    <section className='mt-8'>
      <header className='mb-6 flex items-center justify-between'>
        <h4 className='text-4xl font-bold'>Programs</h4>
        {isSuperAdmin && (
          <Link to='../program/new' className='w-button'>
            Add New Program
          </Link>
        )}
      </header>
      <div className='divide-y-2'>
        {programs.map((program: any) => (
          <ProgramTile key={program.id} program={program} />
        ))}
      </div>
    </section>
  );
}
