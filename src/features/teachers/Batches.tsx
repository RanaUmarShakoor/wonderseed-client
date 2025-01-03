import { Link } from "react-router-dom";
import Program1 from "./images/program-1.png";
import Program2 from "./images/program-2.png";
import Program3 from "./images/program-3.png";
import { resolveUploadUrl, useGetCohort, useGetTeacherCohorts } from "apiconn";
import { useAppStoreKey } from "stores/main";

function groupByProgram(cohorts: any[]) {
  let grouped = {} as Record<string, any[]>;
  let pidToProgram = {} as Record<string, any>;

  for (let i = 0; i < cohorts.length; ++i) {
    let cohort = cohorts[i];
    let { program } = cohort;
    let pid = program.id;

    pidToProgram[pid] = program;

    if (grouped[pid] === undefined) grouped[pid] = [];

    grouped[pid].push(cohort);
  }

  let result = Object.keys(grouped).map(pid => ({
    program: pidToProgram[pid],
    cohorts: grouped[pid]
  }));

  // console.log("RES", result);
  return result;
}

export function Batches() {
  const auth = useAppStoreKey("auth");

  const { data: cohorts, isLoading } = useGetTeacherCohorts(auth.user?.id, {
    keepPreviousData: true,
    initialData: []
  });

  let groups = groupByProgram(cohorts);

  // console.log("TC", cohorts);
  // groupByProgram(cohorts);

  return (
    <div className='sideview-content'>
      <h1 className='mt-10 text-4xl font-bold'>Select a Program to Continue</h1>

      <section id='th-select-program' className='mt-24'>
        {groups.map(({ program, cohorts }) => (
          <Link key={program.id} to={`../batches/chorts/${program.id}`}>
            <div className='program-box grad-1'>
              {/* <img src={Program1} /> */}
              <img
                src={resolveUploadUrl(
                  program.image?.filePath ?? "not-found.png"
                )}
              />
              <h2 className='program-name'>{program.name}</h2>
              <p className='stat-name'>Total Number of Cohort</p>
              <h3 className='stat-value'>{cohorts.length}</h3>
              <p className='stat-name'>Total Number of Students</p>
              <h3 className='stat-value'>
                {cohorts
                  .map((ch: any) => ch.students.length)
                  .reduce((a: number, b: number) => a + b, 0)}
              </h3>
            </div>
          </Link>
        ))}
        {/*
        <div className='program-box grad-2'>
          <img src={Program2} />
          <h2 className='program-name'>Program 2</h2>
          <p className='stat-name'>Total Number of Cohort</p>
          <h3 className='stat-value'>4</h3>
          <p className='stat-name'>Total Number of Students</p>
          <h3 className='stat-value'>25</h3>
        </div>
        <div className='program-box grad-3'>
          <img src={Program3} />
          <h2 className='program-name'>Program 3</h2>
          <p className='stat-name'>Total Number of Cohort</p>
          <h3 className='stat-value'>4</h3>
          <p className='stat-name'>Total Number of Students</p>
          <h3 className='stat-value'>25</h3>
        </div>
         */}
      </section>
    </div>
  );
}
