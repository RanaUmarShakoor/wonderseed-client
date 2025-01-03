import "./ModulesCompleted.scss";

import BadgesEarnedIMG from "./images/badges-earned.png";
import ModulesCompletedIMG from "./images/module-completed.png";
import LearningTimeIMG from "./images/learning-time.png";
import Badge1 from "./images/badge-1.png";
import Badge2 from "./images/badge-2.png";
import TimeSpent from "./images/time-spent.png";
import Reattempts from "./images/reattempts.png";
import { StudentInfoSideView } from "./StudentInfoSideView";
import { TopNav } from "./TopNav";
import { Link, Route, Routes } from "react-router-dom";
import { useAppStoreKey } from "stores/main";
import { resolveUploadUrl, useGetUser } from "apiconn";
import { ExpandedSpinner } from "components/Spinner";
import { useMemo } from "react";
import { BadgeType } from "badge-types";
import { studentLearningTime, useStudentEnrollment } from "utils";

function Main({ badges, enrollment }: { badges: any[]; enrollment: any }) {
  let learningTime = studentLearningTime(enrollment);

  return (
    <>
      <h1 className='mt-10 text-4xl font-bold'>My Progress</h1>
      <section className='mt-10 grid auto-rows-[1fr] grid-cols-1 gap-x-9 gap-y-20 lg:grid-cols-2'>
        <div id='st-progress-grad-1' className='rounded-lg px-8 pt-6'>
          <header className='flex items-start justify-between'>
            <h2 className='text-3xl font-bold'>Badges Earned</h2>
            <Link to='badges-earned'>
              <button className='w-button w-button-outline'>View All</button>
            </Link>
          </header>
          <div className='-mt-1 flex items-center gap-x-12'>
            <img className='h-44 w-44 translate-y-6' src={BadgesEarnedIMG} />
            <span className='text-7xl font-bold'>{badges.length}</span>
          </div>
        </div>
        <div id='st-progress-grad-2' className='rounded-lg px-8 pt-6'>
          <header className='flex items-start justify-between'>
            <h2 className='text-3xl font-bold'>Modules Completed</h2>
            <Link to='modules-completed'>
              <button className='w-button w-button-outline'>View All</button>
            </Link>
          </header>
          <div className='-mt-1 flex items-center gap-x-12'>
            <img
              className='h-44 w-44 translate-y-6'
              src={ModulesCompletedIMG}
            />
            <span className='text-7xl font-bold'>
              {enrollment.completions.length}
            </span>
          </div>
        </div>
        <div id='st-progress-grad-3' className='rounded-lg px-8 pt-6'>
          <header className='flex items-start justify-between'>
            <h2 className='text-3xl font-bold'>Learning Time</h2>
          </header>
          <div className='-mt-1 flex items-center gap-x-12'>
            <img className='h-44 w-44 translate-y-6' src={LearningTimeIMG} />
            <span className='text-7xl font-bold'>{learningTime}</span>
          </div>
        </div>
      </section>
    </>
  );
}

function BadgeEntry(p: { imageURL: string; name: string; date: string }) {
  return (
    <li className='flex gap-x-8 bg-white p-7 even:bg-[#FAFAFA]'>
      <img src={p.imageURL} className='w-24 shrink-0' />
      <div className='flex flex-col justify-center gap-y-1'>
        <h6 className='text-lg font-bold'>{p.name}</h6>
        <p className='text-lg font-bold'>{p.date}</p>
      </div>
    </li>
  );
}

function BadgeGroup(name: string, badges: any[]) {
  if (badges.length === 0) return null;
  return (
    <section className='mb-14'>
      <h2 className='text-2xl font-bold'>{name}</h2>
      <ul className='mt-8'>
        {badges.map((badgeInfo: any) => (
          <BadgeEntry
            key={badgeInfo.badge.id}
            imageURL={resolveUploadUrl(badgeInfo.badge.image.filePath)}
            name={badgeInfo.name || ""}
            date={badgeInfo.granted_at || ""}
          />
        ))}
      </ul>
    </section>
  );
}

function groupBadges(badges: any[]) {
  let grouped = {} as Record<string, any[]>;

  for (let i = 0; i < badges.length; ++i) {
    let { badge } = badges[i];
    let { btype } = badge;
    if (grouped[btype] === undefined) grouped[btype] = [];

    grouped[btype].push(badges[i]);
  }

  return grouped;
}

function Badges({ badges }: { badges: any }) {
  const grouped = useMemo(() => groupBadges(badges), [badges]);

  return (
    <>
      <Link to='..'>
        <img className='page-back-btn' src='/page-back.svg' />
      </Link>
      <div className='mt-9'>
        {BadgeGroup(
          "Consistent Learner Badge",
          grouped[BadgeType.Streak] || []
        )}
        {BadgeGroup(
          "Module Completion Badges",
          grouped[BadgeType.Superhero] || []
        )}
        {BadgeGroup(
          "Coach Acheivement Badges",
          grouped[BadgeType.Achievement] || []
        )}
      </div>
    </>
  );
}

function ModulesCompletedCell({
  imageURL,
  label,
  value
}: {
  imageURL?: string;
  label: string;
  value: string;
}) {
  return (
    <div className='mc-stat-cell flex items-center gap-x-4'>
      {imageURL && <img src={imageURL} className='shrink-0' />}
      <div className='flex flex-col justify-center gap-y-0.5'>
        <h6 className=''>{label}</h6>
        <p className='text-lg font-bold text-black'>{value}</p>
      </div>
    </div>
  );
}

function ModulesCompletedRow({
  row,
  programName
}: {
  row: any;
  programName: string | undefined;
}) {
  // console.log(row);
  return (
    <div className='st-mc-row'>
      <div className='flex flex-col justify-center'>
        <h3 className='text-xl font-bold'>
          {programName && `${programName} - `} Module {row.mod_serial_number}
        </h3>
      </div>
      <ModulesCompletedCell
        imageURL={TimeSpent}
        label='Time Spent'
        value={`${Math.ceil(row.time_spent_secs)} secs`}
      />
      <ModulesCompletedCell
        imageURL={Reattempts}
        label='Reattempts'
        value={row.reattempts}
      />
      <ModulesCompletedCell label='Started' value={row.started_at} />
      <ModulesCompletedCell label='Completed' value={row.ended_at} />
    </div>
  );
}

function ModulesCompleted({
  completions,
  program
}: {
  completions: any;
  program: any;
}) {
  let programName = program?.name;
  return (
    <>
      <Link to='..'>
        <img className='page-back-btn' src='/page-back.svg' />
      </Link>
      <h2 className='mt-5 text-2xl font-bold'>Program A</h2>

      <section
        id='st-modules-completed'
        className='my-10 w-full overflow-x-auto'
      >
        {completions.map((comp: any, index: number) => (
          <ModulesCompletedRow
            programName={programName}
            key={index}
            row={comp}
          />
        ))}
      </section>
    </>
  );
}

export function MyProgess() {
  const auth = useAppStoreKey("auth");
  const { data: user, isLoading: badgesLoading } = useGetUser(auth.user?.id);
  const badges = user?.badges ?? [];

  const {
    cohort,
    data: enrollment,
    isLoading: enrollmentLoading
  } = useStudentEnrollment();
  const completions = enrollment?.completions ?? [];

  if (badgesLoading || enrollmentLoading)
    //
    return (
      <div className='w-screen'>
        <ExpandedSpinner />
      </div>
    );

  return (
    <>
      <StudentInfoSideView />
      <div className='sideview-content-sheet'>
        <TopNav />
        <div className='sideview-content'>
          <Routes>
            <Route
              path='/'
              element={<Main badges={badges} enrollment={enrollment} />}
            />
            <Route path='badges-earned' element={<Badges badges={badges} />} />
            <Route
              path='modules-completed'
              element={
                <ModulesCompleted
                  program={cohort?.program}
                  completions={completions}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </>
  );
}
