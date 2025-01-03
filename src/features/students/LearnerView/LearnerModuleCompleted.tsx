import { useGetUser } from "apiconn";
// import { GlobalMessageButton } from "components/GlobalMessageButton";
import { ExpandedSpinner } from "components/Spinner";
import { Link } from "react-router-dom";
import { useAppStoreKey } from "stores/main";
import { VoidCallback } from "utils";

let cardClasses =
  "md:w-[290px] xl:w-[320px] h-[200px] xl:h-[230px] px-7 lg:px-8 lg:pb-4 flex flex-col justify-around border bg-[#E1EBD0]";

export function LearnerModuleCompleted({
  module_,
  onNext,
  onReattempt,
  programCompleted,
  elapsedSeconds
}: {
  module_: any;
  onNext: VoidCallback;
  onReattempt: VoidCallback;
  programCompleted: boolean;
  elapsedSeconds: number;
}) {
  const auth = useAppStoreKey("auth");
  const { data: user, isLoading } = useGetUser(auth.user?.id);

  if (isLoading)
    //
    return <ExpandedSpinner />;

  // var startDate = startedAt;
  // var endDate = new Date();
  // var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

  return (
    <>
      <h1 className='mb-8 mt-4 text-4xl font-bold text-[#193A32] md:text-3xl'>
        Congratulations, You've completed Module {module_.serial_num}
      </h1>
      <div className='flex flex-col gap-7 md:w-[650px]'>
        <div className='flex flex-col gap-3 md:flex-row lg:gap-5'>
          <div className={cardClasses}>
            <div className='flex justify-between'>
              <h2 className=' flex-1 font-bold text-[#193A32] md:text-xl xl:text-2xl'>
                Badge Obtained
              </h2>
            </div>
            <div className='flex'>
              <div className='relative w-[50%]'>
                <img src='/third/Badge_img.png' className='relative -top-2' />
              </div>
              <h1 className='relative left-2 top-4 flex-1 ps-3 text-5xl font-bold lg:text-6xl xl:text-7xl'>
                {user?.badges?.length + 1 ?? 1}
              </h1>
            </div>
          </div>
          <div
            className={
              "flex h-[200px] flex-col justify-around border bg-[#F5EAC6] px-7 md:w-[290px] lg:px-8 lg:pb-4 xl:h-[230px] xl:w-[320px]"
            }
          >
            <div className='flex justify-between'>
              <h2 className=' flex-1 font-bold text-[#193A32] md:text-xl xl:text-2xl'>
                Time Spent
              </h2>
            </div>
            <div className='flex'>
              <div className='relative w-[50%]'>
                <img src='/third/Rocket_img.png' />
              </div>
              <h1 className='relative left-2 top-4 flex-1 ps-3 text-3xl font-bold xl:text-4xl'>
                {/* 30m */}
                {/* <br /> 30s */}
                {Math.round(elapsedSeconds)}s
              </h1>
            </div>
          </div>
        </div>
        {/*
        <p className='text-base text-[#193A32] opacity-70'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
        </p>
        */}
        <div className='flex gap-x-7'>
          <button onClick={onNext} className='w-button'>
            {programCompleted ? "Finish Program" : "Next Module"}
            <svg
              width='12'
              height='12'
              viewBox='0 0 24 24'
              className='ml-3'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path fill='currentColor' d='M0,0V24L20,12Z' />
            </svg>
          </button>

          <button onClick={onReattempt} className='w-button !bg-green-3'>
            Re-attempt
          </button>
        </div>
      </div>
      {/* <GlobalMessageButton /> */}
    </>
  );
}
