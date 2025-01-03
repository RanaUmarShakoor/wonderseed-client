import { useGetPrograms } from "apiconn";
import { ExpandedSpinner } from "components/Spinner";
import { Link } from "react-router-dom";
import { useCurrentUser } from "utils";

function ProgramTable({ programs }: { programs: any[] }) {
  return (
    <div className='relative mt-10 overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-left text-sm text-gray-500'>
        <thead className='bg-green-1 text-xs uppercase text-white'>
          <tr className='whitespace-nowrap [&>th]:px-6 [&>th]:py-3'>
            <th>Program</th>
            <th className='text-center'>Active Cohorts</th>
            <th className='text-center'>Active Students</th>
            <th>
              <span className='sr-only'></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {programs.map((pg, index) => (
            <tr
              key={index}
              className='border-b bg-white hover:bg-gray-50 [&>td]:px-6 [&>td]:py-3'
            >
              <td className='whitespace-nowrap font-medium text-gray-900'>
                {pg.name}
              </td>
              <td className='text-center'>
                {pg.cohorts.filter((p: any) => p.status === "active").length}{" "}
              </td>
              <td className='text-center'>
                {pg.cohorts
                  .map((ch: any) => ch.students.length)
                  .reduce((a: number, b: number) => a + b, 0)}
              </td>
              <td className='whitespace-nowrap'>
                <div className='flex items-center justify-end gap-x-3'>
                  <Link
                    to={`program/${pg.id}`}
                    className='text-blue-600 hover:underline'
                  >
                    Manage Cohorts
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ListProgramsWithCohorts() {
  const { currentUser, isSuperAdmin } = useCurrentUser();

  let { data: programs, isLoading } = useGetPrograms({
    keepPreviousData: true,
    initialData: []
  });

  if (!isSuperAdmin) {
    programs = programs.filter(p => p.id === currentUser?.program?.id);
  }

  if (isLoading) return <ExpandedSpinner />;

  return (
    <section className='mt-8'>
      <h4 className='mb-6 text-4xl font-bold'>Cohorts</h4>

      {/*
      <div className='flex gap-x-6'>
        <div className='flex flex-col items-start'>
          <div className='floating-select'>
            <select>
              <option>All Programs</option>
              <option>Program A</option>
              <option>Program B</option>
              <option>Program C</option>
            </select>
          </div>
        </div>
        <button className='w-button self-center'>Filter</button>
      </div>
      */}

      <ProgramTable programs={programs} />
    </section>
  );
}
