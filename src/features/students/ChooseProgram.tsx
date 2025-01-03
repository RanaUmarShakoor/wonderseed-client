import { resolveUploadUrl, useGetStudentCohorts } from "apiconn";
import { TopNav } from "features/students/TopNav";
import { Link, useNavigate } from "react-router-dom";
import { useAppStoreKey } from "stores/main";

export function ChooseProgramView() {
  const navigate = useNavigate();
  const auth = useAppStoreKey("auth");
  const confirmCohort = useAppStoreKey("confirmCohort");

  const { data: cohorts, isLoading } = useGetStudentCohorts(auth.user?.id, {
    keepPreviousData: true,
    initialData: []
  });

  function handleSelectCohort(cohortId: any, programId: any) {
    confirmCohort(cohortId, programId);
    navigate("/s/");
  }

  return (
    <main className='w-screen overflow-x-hidden pb-32'>
      <div className='flex items-center justify-between px-8'>
        <Link to='/s' className='shrink-0'>
          <img src='/logo-name.png' className='relative top-5 h-28 w-28' />
        </Link>
        <TopNav />
      </div>

      <div className='mx-auto mt-10 grid w-[80%] gap-10 md:grid-cols-2 lg:grid-cols-3 xl:w-[70%] xl:gap-16'>
        {cohorts.map((cohort, index) => (
          <div key={index}>
            <img
              src={resolveUploadUrl(
                cohort.program.image?.filePath ?? "not-found.png"
              )}
              alt=' '
              className='mx-auto w-[50%]'
            />
            <div className=' -mt-12 rounded-3xl bg-gradient-to-b from-[#81AE38] to-[#EEF4E5] py-20 shadow-md shadow-[#06755F] md:-mt-10 lg:-mt-8 xl:-mt-10 2xl:-mt-10'>
              <p className='text-center text-[25px] font-bold text-[#193a32]'>
                {cohort.program.name}
              </p>
              <button
                onClick={() => handleSelectCohort(cohort.id, cohort.program.id)}
                className='w-button mx-auto mt-20 block'
              >
                Get Started
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
