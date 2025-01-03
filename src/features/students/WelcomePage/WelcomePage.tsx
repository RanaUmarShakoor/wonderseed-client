import atom_img from "./images/Atom_img.png";
import dot_matrix_img from "./images/Dot_Matrix_img.png";
import triangle_img from "./images/Triangle_img.png";
import line_matrix_img from "./images/Line_Matrix_img.png";
import c_shaped_img from "./images/C-Shaped_img.png";
import duster_img from "./images/Duster_img.png";
import { Link, useNavigate } from "react-router-dom";
import { TopNav } from "../TopNav";
import { resolveUploadUrl, useGetProgram } from "apiconn";
import { useAppStoreKey } from "stores/main";
import { ExpandedSpinner } from "components/Spinner";
import { useStudentEnrollment } from "utils";
import { useEffect, useLayoutEffect } from "react";

export function WelcomePage() {
  const navigate = useNavigate();
  const auth = useAppStoreKey("auth");

  const programId = auth.programId;

  const { data: program, isLoading: isProgramLoading } = useGetProgram(programId);
  const { data: enrollment, isLoading } = useStudentEnrollment(programId);

  useLayoutEffect(() => {
    if (isLoading || enrollment == undefined)
      return;

    let { current_module, current_day } = enrollment;
    console.log(current_module, current_day);

    // If student has already started learning
    if (!(current_module == 0 && current_day == 0))
      navigate("/s/program");
  }, [enrollment]);

  if (isLoading || isProgramLoading)
    //
    return <ExpandedSpinner flex />;

  // let program = cohort?.program;

  return (
    <main className='relative h-screen w-screen overflow-x-hidden'>
      <div className='absolute top-0 -z-50 h-[78%] w-full overflow-hidden bg-gradient-to-b from-[#E0EBCE] to-[#FFFFFF]'></div>
      {/* <NavBar logo={1} /> */}
      <div className='flex items-center justify-between px-8'>
        <Link to='/s' className='shrink-0'>
          <img src='/logo-name.png' className='relative top-5 h-28 w-28' />
        </Link>
        <TopNav />
      </div>
      <section className='relative'>
        <div className='flex w-screen flex-col items-center overflow-x-hidden'>
          <div className='flex w-[90%] flex-1 flex-col items-center gap-y-9 overflow-x-hidden pt-4 md:w-[75%] lg:w-[65%] xl:w-[58%]'>
            <h1 className='xxs:text-2xl text-xl font-bold text-[#193A32] md:text-3xl lg:text-4xl'>
              Welcome to {program.name}
            </h1>
            <div className='overflow-x-hidden'>
              <p className='text-center text-sm font-medium text-[#193A32] opacity-70 md:text-base lg:text-lg '>
                {/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum */}
                {program.welcome_msg}
              </p>
              <img
                src={line_matrix_img}
                className='absolute -left-9 top-[34%] h-16 lg:-left-10 lg:h-20 xl:h-24'
              />
              <img
                src={duster_img}
                className='absolute right-2 top-[42%] w-16 md:right-[7%] md:top-[38%] lg:w-20 xl:w-24'
              />
            </div>
            <Link
              to={
                program.preassessment
                  ? "/s/program/preassessment"
                  : "/s/program"
              }
              type='button'
              className='w-button'
            >
              Get Started
            </Link>
            {program.image && (
              <img className="max-w-full" src={resolveUploadUrl(program.image.filePath)} />
            )}
          </div>
          <div className='relative flex-1'>
            <img
              src={atom_img}
              className='h-[260px] w-[260px] md:h-[300px] md:w-[300px] lg:h-[334px] lg:w-[334px] xl:h-[384px] xl:w-[384px] invisible'
            />
            <div className='xxs:-left-[20%] absolute -left-[10%] top-[50%] h-20 w-20 md:-left-[40%] md:h-28 md:w-28 lg:-left-[60%] xl:-left-[100%]'>
              <img
                src={dot_matrix_img}
                className='z-10 h-12 md:h-16 xl:h-[77px]'
              />
              <img
                src={triangle_img}
                className='absolute -top-3 z-10 h-12 md:h-16 xl:h-[74px]'
              />
            </div>
            <img
              src={c_shaped_img}
              className='xxs:-right-[26%] absolute -right-[10%] bottom-1 w-12 md:-right-[56%] md:bottom-12 md:w-16 lg:-right-[82%] xl:-right-[115%] xl:w-20'
            />
          </div>
        </div>
      </section>
    </main>
  );
}
