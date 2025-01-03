import { useGetCohort } from "apiconn";
import { ProgressBar } from "components/ProgressBar/ProgressBar";
import { ExpandedSpinner } from "components/Spinner";
import { handleDownloadCohort } from "download-progress";
import { calcProgress, resolveUserPfp, studentLearningTime } from "utils";

function StatBar({ cohort }: { cohort: any }) {
  let numStudents = cohort.students.length;
  let overall = 0;

  if (numStudents > 0) {
    let accProgress = 0;
    for (let i = 0; i < numStudents; ++i) {
      let { progress } = calcProgress(cohort.program, cohort.students[i]);
      accProgress += progress;
    }
    overall = accProgress / numStudents;
  }

  return (
    <section className='mt-8 flex flex-col justify-between gap-y-2 text-lg lg:flex-row lg:items-center'>
      <p>
        Cohort Size: <span className='font-bold'>{cohort.students.length}</span>
      </p>
      <div>
        Cohort Progress:
        <span className='ml-1 font-bold'>
          {Math.round(overall * 100)}%
        </span>{" "}
        completed
        <ProgressBar className='ml-3 inline-block w-44' time={overall} />
      </div>
      <button
        onClick={() => handleDownloadCohort(cohort)}
        className='flex items-center gap-x-3'
      >
        Download Progress
        <img src='/download.svg' className='' />
      </button>
    </section>
  );
}

function Row(p: {
  cohort: any;
  student: any;
  iconURL: string;
  name: string;
  id: string;
  progress: number;
  level: string;
  timeSpent: string;
}) {
  return (
    <tr>
      <td className='flex items-center gap-x-6'>
        <img className='h-14 w-14 shrink-0' src={p.iconURL} />
        {p.name}
      </td>
      <td>
        <p>{p.id}</p>
      </td>
      <td>
        <span>{Math.round(p.progress * 100)}% completed</span>
        <ProgressBar className='mt-2 w-28' time={p.progress} />
      </td>
      <td>{p.level}</td>
      <td>{p.timeSpent}</td>
      <td>
        <button
          onClick={() => handleDownloadCohort(p.cohort, p.student)}
          className='box-content rounded-lg p-1.5 transition-colors hover:bg-green-3/30'
        >
          <img src='/download.svg' className='' />
        </button>
      </td>
    </tr>
  );
}

function Table({ cohort }: { cohort: any }) {
  return (
    <div className='my-10 w-full overflow-x-auto'>
      <table id='th-progress-table' className='w-full'>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student ID</th>
            <th>Progress</th>
            <th>Current Module</th>
            <th>Time Spent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cohort.students.map((student: any) => {
            let { modSerial, progress } = calcProgress(cohort.program, student);

            return (
              <Row
                cohort={cohort}
                student={student.user}
                key={student.id}
                iconURL={resolveUserPfp(student.user)}
                name={`${student.user.first_name} ${student.user.last_name}`}
                id={student.user.app_id}
                progress={progress}
                level={modSerial}
                timeSpent={studentLearningTime(student)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CohortProgressView({ cohortId }: { cohortId: any }) {
  let { data: cohort, isLoading } = useGetCohort(cohortId);

  if (isLoading)
    //
    return <ExpandedSpinner />;

  return (
    <div>
      <h1 className='mt-5 text-center text-4xl font-bold'>{cohort.app_id}</h1>
      <StatBar cohort={cohort} />
      <Table cohort={cohort} />
    </div>
  );
}
