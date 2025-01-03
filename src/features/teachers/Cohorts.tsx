import { useGetProgram, useGetTeacherCohorts } from "apiconn";
import { BackArrowButton } from "components/BackArrowButton";
import { Link, useParams } from "react-router-dom";
import { useAppStoreKey } from "stores/main";

function CohortEntry({ cohort }: { cohort: any }) {
  return (
    <div className='entry'>
      <p className='name'>{cohort.app_id}</p>
      <p className='students'>
        Students: <span>{cohort.students.length}</span>
      </p>
      <p className='description'>{cohort.program.name}</p>
      <Link to={`../batches/chort-progress/${cohort.id}`} className='progress'>
        Check Progress
      </Link>
    </div>
  );
}

export function Cohorts() {
  const { programId } = useParams();

  const auth = useAppStoreKey("auth");

  const { data: cohorts, isLoading } = useGetTeacherCohorts(auth.user?.id, {
    keepPreviousData: true,
    initialData: []
  });
  let filtered = cohorts.filter((c: any) => c.program.id === programId);
  // console.log("FILTERED", filtered);

  return (
    // -mx-8 px-8: FIXME: Temporary hack to push the scrollbar on the
    // edge of screen
    <div className='sideview-content'>
      <BackArrowButton />

      <h1 className='mt-5 text-4xl font-bold'>Program 1</h1>
      <h2 className='mt-5 text-2xl font-bold'>Cohorts</h2>

      <section id='th-cohorts-list'>
        {cohorts.map((c: any) => (
          <CohortEntry key={c.id} cohort={c} />
        ))}
      </section>
    </div>
  );
}
