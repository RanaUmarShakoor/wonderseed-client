import { SideView } from "components/SideView/SideView";
import { Link } from "react-router-dom";
import ProfileAvatar from "assets/profile-avatar.png";
import { ProgressBar } from "components/ProgressBar/ProgressBar";
import { useAppStoreKey } from "stores/main";
import { resolveUserPfp, useStudentCohort, useStudentEnrollment } from "utils";
import { useGetUser } from "apiconn";
import { ReactNode } from "react";

export function StudentInfoSideView() {
  const auth = useAppStoreKey("auth");
  const cohortConfirmed = useAppStoreKey("cohortConfirmed");

  const { data: cohort } = useStudentCohort();
  const { data: enrollment } = useStudentEnrollment();
  const { data: student, isSuccess: userLoaded } = useGetUser(auth.user.id);

  // let currentModule = cohort?.program?.modules[enrollment?.current_module || 0] ?? 0
  let program = cohort?.program;
  let modules = program?.modules || [];
  let current_module = enrollment?.current_module;

  let continueToModule: any | null = null;
  if (
    current_module !== undefined &&
    modules.length > 0 &&
    current_module < modules.length
  )
    continueToModule = modules[current_module];

  let totalModules = program?.modules.length ?? 0;
  let progress: number;
  if (totalModules === 0) progress = 1;
  else {
    progress = Math.min(enrollment.current_module, totalModules) / totalModules;
  }

  let progressPercent = Math.round(progress * 100);

  const programCompleted = progress >= 1;

  let programInfoView: ReactNode = null;

  if (cohortConfirmed) {
    programInfoView = (
      <>
        <h4 className='mt-10 text-xl font-bold'>{program?.name} Completion</h4>
        <h5 className='mt-2 text-lg text-black'>
          {progressPercent}% completed
        </h5>
        <ProgressBar className='mt-3.5 self-stretch' time={progress} />

        {programCompleted ? (
          <>
            <Link
              to='/s/program/program-completed'
              className='w-button mt-4 self-stretch'
            >
              Download Certificate
            </Link>
          </>
        ) : (
          <>
            {continueToModule && (
              <>
                {" "}
                <p className='mt-12 text-xl'>You're on</p>
                <h2 className='mt-1 text-3xl font-bold'>
                  Module {continueToModule.serial_num}
                </h2>
              </>
            )}

            <Link
              to='/s/program'
              className='w-button w-button-outline mt-5 inline-block'
            >
              Continue
            </Link>
          </>
        )}
      </>
    );
  }

  return (
    <SideView>
      <div>
        <Link
          to='/s'
          className='h-28 w-28 shrink-0 self-start overflow-hidden rounded-full'
        >
          <img src='/logo-name.png' className='h-full w-full' />
        </Link>
        {userLoaded && (
          <section className='mt-14 flex items-center gap-x-3'>
            <div className='h-16 w-16 shrink-0'>
              <img src={resolveUserPfp(student)} />
            </div>
            <h4 className='text-lg font-bold'>Hello, {student.first_name}</h4>
          </section>
        )}

        {programInfoView}
      </div>
    </SideView>
  );
}
