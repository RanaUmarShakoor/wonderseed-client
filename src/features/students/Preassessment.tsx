import { Link, useNavigate } from "react-router-dom";
import { TopNav } from "./TopNav";
import { useEffect, useId, useRef } from "react";
// import { GlobalMessageButton } from "components/GlobalMessageButton";
import { useAppStoreKey } from "stores/main";
import { useGetProgram } from "apiconn";
import { ExpandedSpinner } from "components/Spinner";
import { RenderDesign } from "./LearnerView/RenderDesign";
import { CtrlSet } from "./LearnerView/common";
import { useStudentEnrollment } from "utils";

function Skip() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/s/program");
  }, []);
  return null;
}

export function Preassessment() {
  const auth = useAppStoreKey("auth");
  const { data: program, isLoading } = useGetProgram(auth.programId);
  const ctrlset = useRef<CtrlSet>({}).current;

  const { data: enrollment, isLoading: enrollLoading } = useStudentEnrollment();

  if (isLoading || enrollLoading)
    //
    return <ExpandedSpinner flex />;

  if (enrollment.current_module && enrollment.current_module > 0)
    return <Skip />;

  return (
    <div className='relative min-h-screen flex-1 overflow-y-auto'>
      <GhostImages />
      <div className='relative'>
        <div className='absolute bottom-0 left-0'>
          <img src='/pat-ghost-4.svg' className='w-[290px]' />
        </div>

        <div className='mx-8 flex items-center justify-between'>
          <Link to='/s' className='shrink-0'>
            <img src='/logo-name.png' className='relative top-5 h-28 w-28' />
          </Link>
          <TopNav />
        </div>

        <h2 className='mx-4 mt-16 text-center text-4xl font-black'>
          Pre-Assessment Quiz
        </h2>
        <section className='relative mt-8 px-4 pb-32 md:mx-auto md:w-[720px]'>
          <h4 className='mb-6 font-bold'>Select the Right Answers</h4>
          <div className='mb-6 space-y-10'>
            <RenderDesign
              design={program.preassessment_content || []}
              ctrlset={ctrlset}
              viewID="prs"
            />
          </div>
          <Link to='/s/program' className='w-button inline-flex'>
            Submit
          </Link>
        </section>
      </div>
      {/* <GlobalMessageButton /> */}
    </div>
  );
}

function GhostImages() {
  return (
    <div
      className='max-w-screen pointer-events-none absolute
    left-0
    top-0 max-h-none min-h-screen
    w-screen overflow-x-hidden overflow-y-hidden'
    >
      <img className='absolute -right-36 top-32' src='/pat-ghost-1.svg' />
      <img
        className='absolute right-20 top-[500px] h-[97px]'
        src='/pat-ghost-2.png'
      />
      <img
        className='absolute bottom-[10px] left-10 h-[97px]'
        src='/pat-ghost-3.png'
      />
    </div>
  );
}
