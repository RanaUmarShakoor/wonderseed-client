import { useGetProgram } from "apiconn";
import cx from "classnames";
import { BackArrowButton } from "components/BackArrowButton";
import { ExpandedSpinner } from "components/Spinner";
import { Link, useParams } from "react-router-dom";
import { useCurrentUser } from "utils";

function maybeDate(date: string | undefined): string {
  if (date == undefined) return "N/A";

  // TODO: Apply formatting
  return date || "N/A";
}

function CohortTable({ cohorts }: { cohorts: any[] }) {
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-left text-sm'>
        <thead className='bg-green-1 text-xs uppercase text-white'>
          <tr className='whitespace-nowrap [&>th]:px-6 [&>th]:py-3'>
            <th>Cohort ID</th>
            <th className='text-center'>Students</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>
              <span className='sr-only'></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {cohorts.map((ch, index) => (
            <tr
              key={index}
              className='border-b bg-white hover:bg-gray-50 [&>td]:px-6 [&>td]:py-3'
            >
              <td className='whitespace-nowrap font-bold'>{ch.app_id}</td>
              <td className='text-center'>{ch.students.length}</td>
              <td
                className={cx(
                  "font-bold",
                  ch.status == "active" ? "text-green-500" : "text-orange-500"
                )}
              >
                {ch.status == "active" ? "Active" : "Completed"}
              </td>
              <td>{maybeDate(ch.start_date)}</td>
              <td>{maybeDate(ch.end_date)}</td>
              <td className='whitespace-nowrap'>
                <div className='flex items-center justify-end gap-x-3'>
                  <Link
                    to={`../cohort/view/${ch.id}`}
                    className='text-blue-600 hover:underline'
                  >
                    Manage
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

export function ProgramIndexView() {
  const { isResearcher } = useCurrentUser();
  const { programId } = useParams();

  let { data: program, isLoading } = useGetProgram(programId);

  if (isLoading)
    //
    return <ExpandedSpinner />;

  return (
    <section className='mt-8'>
      <BackArrowButton useLink />
      <header className='flex items-center'>
        <h4 className='mb-8 text-4xl font-bold'>{program.name} Cohorts</h4>
        {!isResearcher && (
          <Link to={`../cohort/new/${programId}`} className='w-button ml-auto'>
            Add Cohort
          </Link>
        )}
      </header>
      <CohortTable cohorts={program.cohorts} />
    </section>
  );
}
