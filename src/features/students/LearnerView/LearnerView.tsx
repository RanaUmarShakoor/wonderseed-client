import "./LearnersView.scss";

import { TopNav } from "../TopNav";
import { ModuleSidebar } from "./ModuleSidebar";
import {
  Fragment,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { ProgressBar } from "components/ProgressBar/ProgressBar";
import { LearnerModuleCompleted } from "./LearnerModuleCompleted";
import { Character } from "components/Character";
// import { GlobalMessageButton } from "components/GlobalMessageButton";
import { useAppStoreKey } from "stores/main";
import { apiConn, resolveUploadUrl, useGetProgram } from "apiconn";
import { ExpandedSpinner } from "components/Spinner";
import { RenderDesign } from "./RenderDesign";
import { CtrlSet, timeElapsedSince } from "./common";
import { useCurrentUser, useStudentCohort } from "utils";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type ViewType = "intro" | "content" | "assessment";

function DayIntroCard(title: string, body: ReactNode) {
  return (
    <div className='rounded-3xl bg-gradient-to-b from-[#A8C777] to-[#EEF4E5] p-8 shadow-md shadow-[#81AE38]'>
      <div className='inline-flex flex-col'>
        <p className='text-[20px] font-bold uppercase text-[#193a32]'>
          {title}
        </p>
        <div className='border-b-4 border-[#337360]'></div>
      </div>
      <p className='mt-2 text-[15px] font-bold text-[#193a32]'>{body}</p>
    </div>
  );
}

function DayIntro(day: any) {
  if (day == undefined) {
    return null;
  }

  return (
    <>
      <div className='mt-10 w-[80%] space-y-10 xl:w-[50%]'>
        {DayIntroCard("Purpose", day.purpose)}
        {DayIntroCard("Super Power", day.super_power)}
        {DayIntroCard("Subject Description", day.description)}
      </div>
    </>
  );
}

function Learning({
  program,
  module_,
  dayIndex,
  reattempts,
  historyMode,
  onModCompleted,
  onDayStarted
}: {
  program: any;
  module_: any;
  dayIndex: number;
  reattempts: number;
  historyMode: boolean;
  onModCompleted: () => void;
  onDayStarted: (newDayIndex: number) => void;
}) {
  const [view, setView] = useState<ViewType>("intro");
  const ctrlset = useRef<CtrlSet>({}).current;

  useEffect(() => {
    // setView("content");
    setView("intro");
  }, [module_, dayIndex, reattempts]);

  let dayObj = module_.days[dayIndex];
  let design: any[] = view == "content" ? dayObj?.content : dayObj?.assessment;
  design = design ?? [];

  async function handleNextDay() {
    let nextIndex = dayIndex + 1;
    if (nextIndex >= module_.days.length) {
      // Module completed
      onModCompleted();
    } else {
      // Get the next day;
      setView("content");
      onDayStarted(nextIndex);
    }
  }

  function handleProgress() {
    if (view === "intro") {
      setView("content");
      return;
    }

    let pass = true;

    for (let i = 0; i < design.length; ++i) {
      let allowNext = ctrlset[i]?.allowNext;
      if (allowNext == undefined) continue;

      if (!allowNext()) {
        pass = false;
        break;
      }
    }

    console.log("PASS", pass);

    if (!historyMode && !pass) {
      // Consumers of Coaches Programs are allowed to skip content (currently just videos, which is
      // also what's currenly implemented by allowNext() above).

      if (!(program.program_type == "coach"))
        return alert("Please finish the content first");
    }

    // Reset the ctrlset once the page is disposed
    Object.keys(ctrlset).forEach((key: any) => delete ctrlset[key]);

    if (view === "content") {
      // Only show assessment if it is non-empty
      if (dayObj?.assessment?.length > 0) {
        setView("assessment");
      } else {
        handleNextDay();
      }
    } else {
      handleNextDay();
    }
  }

  if (module_.days.length === 0)
    return (
      <div>
        <p className='mb-6'>Module is empty. Contact Administration</p>
        <button className='w-button'>Move to next module</button>
      </div>
    );

  return (
    <>
      <h1 className='mb-5 mt-1 flex items-center text-4xl font-bold'>
        <span>Module {module_.serial_num}</span>
        <span className='mx-6 inline-block h-3 w-3 rounded-full bg-[#CCCCCC]' />
        <span className='text-[#7B7B7B]'>Day {dayObj?.serial_num}</span>
        <span className='ml-4 self-end text-2xl text-[#464646]'>
          {dayObj?.name}
        </span>
      </h1>
      <ProgressBar
        className='mb-8'
        time={dayIndex / (module_.days.length - 1)}
        milestones={module_.days.length}
        completedMilestones={dayIndex}
      />
      <section className='mt-14 space-y-4'>
        {view == "intro" ? (
          DayIntro(dayObj)
        ) : (
          <RenderDesign
            viewID={`mod-${module_.serial_num}-day-${dayIndex}-`}
            ctrlset={ctrlset}
            design={design}
          />
        )}
      </section>
      <button onClick={handleProgress} className='w-button mt-6'>
        Next
      </button>
      {/* <Character src='/characters/c6.png' /> */}
      <Character
        src={resolveUploadUrl(dayObj?.character?.filePath || "not-found.png")}
      />
      {/* <GlobalMessageButton /> */}
    </>
  );
}

export function LearnerView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const auth = useAppStoreKey("auth");

  /* ========= stats ========= */

  const [reattempts, setReattempts] = useState(0);
  const [startedAt, setStartedAt] = useState<Date>(new Date());
  const [endedAt, setEndedAt] = useState<Date>(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  /* ========= data ========= */

  const { isCoach } = useCurrentUser();

  const { data: cohort, isLoading: cohortLoading } = useStudentCohort();

  const { data: program, isLoading: programLoading } = useGetProgram(
    auth.programId,
    { includeDays: true }
  );

  let [modCompleted, setModCompleted] = useState(false);
  let [programCompleted, setProgramCompleted] = useState(false);
  let [modIndex, setModIndex] = useState(0);
  let [dayIndex, setDayIndex] = useState(0);

  let [modIndexFW, setModIndexFW] = useState(0);
  let [dayIndexFW, setDayIndexFW] = useState(0);

  const historyMode = modIndexFW != modIndex || dayIndexFW != dayIndex;

  const forwardSetMod = (index: number) => {
    setModIndex(index);
    if (!historyMode) setModIndexFW(index);
  };

  const forwardSetDay = (index: number) => {
    setDayIndex(index);
    if (!historyMode) setDayIndexFW(index);
  };

  function handleBack() {
    if (dayIndex > 0) {
      setDayIndex(dayIndex - 1);
    } else {
      if (modIndex > 0) {
        let newModIndex = modIndex - 1;
        setModIndex(newModIndex);
        let mod = program?.modules[modIndex];
        setDayIndex(mod?.days.length ?? 0);
      }
    }
  }

  useLayoutEffect(() => {
    if (cohortLoading || cohort == undefined) return;

    let studentInfo = cohort.students.find(
      (st: any) => st.user.id === auth.user?.id
    );
    let current_module = studentInfo.current_module ?? 0;
    let current_day = studentInfo.current_day ?? 0;

    console.log(`Jumping to Module ${current_module} Day ${current_day}`);

    if (current_module >= cohort.program.modules.length)
      navigate("/s/program/program-completed");
    else forwardSetMod(current_module);

    if (current_day === -1) {
      setModCompleted(true);
    } else if (current_day === -2) {
      setModCompleted(true);
      setProgramCompleted(true);
    } else {
      forwardSetDay(current_day);
    }

    let mod_elapsed_seconds = studentInfo.mod_elapsed_seconds ?? -1;
    if (mod_elapsed_seconds !== -1) {
      setElapsedSeconds(mod_elapsed_seconds);

      let now = new Date();
      // If the module had just completed prior then we, for now, upon resuming progress
      // assume that the module has *just* ended...
      setEndedAt(now);
      // ... and started `mod_elapsed_seconds` seconds in the past.
      setStartedAt(new Date(now.getTime() - mod_elapsed_seconds * 1000));
    }
  }, [cohortLoading]);

  useEffect(() => {
    setReattempts(0);
    setStartedAt(new Date());
  }, [modIndex, program]);

  let module_ = program?.modules[modIndex];

  const getNextModule = () => {
    if (program == undefined) return;

    let { modules } = program;
    let nextIndex = -1;

    for (let n = modIndex + 1; n < modules.length; ++n) {
      if (modules[n].status === "published") {
        nextIndex = n;
        break;
      }
    }

    return nextIndex;
  };

  async function grantModuleBadge() {
    if (!historyMode) {
      await apiConn.post(`/assign-badge`, {
        badge_id: module_.completion_badge.id,
        user_id: auth.user?.id,
        name: `Module ${module_.serial_num} Completed`
      });
      queryClient.invalidateQueries({ queryKey: ["user", auth.user?.id] });
    }
  }

  async function applyModuleCompletition() {
    let nextIndex = getNextModule();

    if (nextIndex === undefined) return;

    if (nextIndex === -1) nextIndex = (program?.modules.length || 1) as number;

    if (!historyMode) {
      await apiConn.post(`/apply-learning-progress`, {
        cohort_id: cohort?.id,
        student_id: auth.user?.id,
        type: "module",
        current_module: nextIndex,
        completion: {
          mod_serial_number: module_?.serial_num || 0,
          time_spent_secs: elapsedSeconds,
          reattempts: reattempts,
          started_at: formatDate(startedAt),
          ended_at: formatDate(endedAt)
        }
      });

      queryClient.invalidateQueries({ queryKey: ["cohort", auth.cohortId] });
    }

    forwardSetMod(nextIndex);
    forwardSetDay(0);
  }

  async function confirmNextModule() {
    await grantModuleBadge();
    await applyModuleCompletition();
    setModCompleted(false);
    if (programCompleted) {
      navigate("/s/program/program-completed");
    } else {
      setModCompleted(false);
    }
  }

  async function onModCompleted() {
    let next = getNextModule();
    if (next === undefined) return;

    setElapsedSeconds(timeElapsedSince(startedAt));
    setEndedAt(new Date());

    if (next === -1) {
      // Program Completed
      setProgramCompleted(true);
      onDayStarted(-2); // -2 = End of program
    } else {
      onDayStarted(-1); // -1 = End of module
    }

    setModCompleted(true);
  }

  /* ============= Days =============== */
  async function onDayStarted(newDayIndex: number) {
    console.log("onDayStarted", newDayIndex);
    forwardSetDay(newDayIndex);
    if (!historyMode) {
      await apiConn.post(`/apply-learning-progress`, {
        cohort_id: cohort?.id,
        student_id: auth.user?.id,
        type: "day",
        current_day: newDayIndex,
        // The last (asynchronous) setElapsedSeconds(...) might not have completed until here, so
        // here we recalculate the time.
        mod_elapsed_seconds: timeElapsedSince(startedAt)
      });
      queryClient.invalidateQueries({ queryKey: ["cohort", auth.cohortId] });
    }
  }

  if (programLoading || cohortLoading)
    //
    return <ExpandedSpinner flex />;

  const showBackButton = !modCompleted && !!module_;

  return (
    <Fragment>
      <ModuleSidebar
        onDayClicked={targetIndex => {
          if (isCoach || targetIndex <= dayIndexFW || modIndex < modIndexFW) {
            setDayIndex(targetIndex);
          }
        }}
        onModuleClicked={targetIndex => {
          if (isCoach || modIndex < modIndexFW) {
            setModIndex(targetIndex);
          }
        }}
        program={program}
        modIndex={modIndex}
        dayIndex={dayIndex}
      />
      <div className='sideview-content-sheet'>
        <TopNav />
        {/* Back button */}
        {showBackButton && (
          <button onClick={handleBack} className='-translate-y-8 inline w-[60px]'>
            <img className='page-back-btn' src='/page-back.svg' />
          </button>
        )}
        {/* Content */}
        <div className='sideview-content'>
          {modCompleted ? (
            <LearnerModuleCompleted
              module_={module_}
              onNext={confirmNextModule}
              programCompleted={programCompleted}
              // startedAt={startedAt}
              elapsedSeconds={elapsedSeconds}
              onReattempt={() => {
                setReattempts(x => x + 1);
                setModCompleted(false);
                setProgramCompleted(false);
                onDayStarted(0);
              }}
            />
          ) : (
            module_ && (
              <Learning
                program={program}
                module_={module_}
                dayIndex={dayIndex}
                reattempts={reattempts}
                historyMode={historyMode}
                onModCompleted={onModCompleted}
                onDayStarted={onDayStarted}
              />
            )
          )}
        </div>
      </div>
    </Fragment>
  );
}

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  let mm: any = date.getMonth() + 1; // Months start at 0!
  let dd: any = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  // return dd + "/" + mm + "/" + yyyy;
  return yyyy + "-" + mm + "-" + dd;
}
