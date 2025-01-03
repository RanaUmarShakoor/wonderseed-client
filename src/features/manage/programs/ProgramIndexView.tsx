import { useQuery } from "@tanstack/react-query";
import { apiConn, callApiGet, useGetProgram } from "apiconn";
import cx from "classnames";
import { BackArrowButton } from "components/BackArrowButton";
import { ExpandedSpinner } from "components/Spinner";
import { Link, useParams } from "react-router-dom";
import { useCurrentUser } from "utils";

function ModuleStats({ program }: { program: any }) {
  const { isResearcher } = useCurrentUser();

  return (
    <div className='mt-8 flex items-center justify-between'>
      <div className='flex gap-x-8'>
        <span>
          <strong>Modules:</strong> {program.modules.length}
        </span>
        {/*
        <span>
          <strong>Duration:</strong> 40 min
        </span>
        */}
      </div>
      {!isResearcher && (
        <Link to={`../module/new/${program.id}`} className='w-button'>
          Add New Module
        </Link>
      )}
    </div>
  );
}

function ModuleTile({ module_ }: { module_: any }) {
  const { isResearcher } = useCurrentUser();

  let status = module_.status;

  let statusClass = "",
    statusText = "";
  if (status === "published") {
    statusClass = "border-blue-300 bg-blue-100 text-blue-700";
    statusText = "Published";
  } else {
    statusClass = "border-amber-300 bg-amber-100 text-amber-700";
    statusText = "Draft";
  }

  return (
    <div className='flex items-start bg-white px-4 py-4'>
      <div className='flex-1'>
        <h2 className='mb-1 text-xl font-bold'>Module {module_.serial_num}</h2>
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
            <strong>Days:</strong> {module_.days.length}
          </span>
          {/*
          <span>
            <strong>Duration:</strong> 120min
          </span>
          */}
          <span>
            <strong>Badge:</strong> {module_.completion_badge.name}
          </span>
        </div>
      </div>
      {!isResearcher && (
        <Link to={`../module/${module_.id}`} className='w-button shrink-0'>
          Edit
        </Link>
      )}
    </div>
  );
}

export function ProgramIndexView() {
  const { isResearcher } = useCurrentUser();
  const programId = useParams().programId;

  let { data: program, isLoading } = useGetProgram(programId, {
    includeDays: true
  });

  if (isLoading)
    //
    return <ExpandedSpinner />;

  return (
    <section className='mt-8' data-pid={programId}>
      <BackArrowButton useLink />

      <header className='flex items-start gap-x-4'>
        <div className='flex-1'>
          <h4 className='mb-4 text-3xl font-bold'>{program.name}</h4>
          <p>{program.welcome_msg}</p>
        </div>
        {!isResearcher && (
          <>
            <Link to={`../program/edit/${programId}`} className='w-button'>
              Edit Program
            </Link>
            {program.preassessment && (
              <Link
                to={`../program/design-ps/${programId}`}
                className='w-button inline-block'
              >
                Design Preassessment
              </Link>
            )}
          </>
        )}
      </header>

      <div className='mt-4 flex gap-x-8'>
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

      <Link
        to={`../../cohorts/program/${programId}`}
        className='w-button w-button-outline mt-4 inline-block'
      >
        Manage Cohorts
      </Link>

      <ModuleStats program={program} />
      <div className='mt-4 divide-y-2'>
        {program.modules.map((module_: any) => (
          <ModuleTile key={module_.id} module_={module_} />
        ))}
      </div>
    </section>
  );
}
