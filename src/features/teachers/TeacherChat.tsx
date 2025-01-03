import { useGetTeacherCohorts } from "apiconn";
import { Messages } from "components/Messages/Messages";
import { ChatHandle } from "components/Messages/common";
import { ExpandedSpinner } from "components/Spinner";
import { useAppStoreKey } from "stores/main";

import CountryIcon from "./images/country.svg";
import EmailIcon from "./images/email.svg";
import CrossIcon from "./images/cross.svg";
import BadgesEarnedIMG from "./images/badges-earned.png";
import ModulesCompletedIMG from "./images/module-completed.png";
import LearningTimeIMG from "./images/learning-time.png";

import { Dialog } from "@headlessui/react";
import { VoidCallback, resolveUserPfp, studentLearningTime } from "utils";
import { useGetUser } from "apiconn";
import { fullname } from "components/Messages/common";
import { useState } from "react";

export const TeacherChat = () => {
  const [modelChat, setModalChat] = useState<ChatHandle | null>(null);

  const auth = useAppStoreKey("auth");

  const { data: cohorts, isLoading } = useGetTeacherCohorts(auth.user?.id, {
    keepPreviousData: true,
    initialData: []
  });

  if (isLoading) return <ExpandedSpinner />;

  let chatlist = [] as ChatHandle[];
  for (let i = 0; i < cohorts.length; ++i) {
    let cohort = cohorts[i];
    for (let s = 0; s < cohort.students.length; ++s) {
      let student = cohort.students[s];
      chatlist.push({ cohort: cohort, user: student.user });
    }
  }

  return (
    <div className='-mr-8 mt-11 flex-1'>
      <Messages chatlist={chatlist} onUserInfo={chat => setModalChat(chat)} />
      <StudentModel chat={modelChat} onClose={() => setModalChat(null)} />
    </div>
  );
};

/* =========================================================================== */
/* =========================================================================== */
/* =========================================================================== */
/* =========================================================================== */
/* =========================================================================== */

export function StudentModel({
  chat,
  onClose
}: {
  chat: ChatHandle | null;
  onClose: VoidCallback;
}) {
  let modalOpen = chat !== null;
  return (
    <Dialog open={modalOpen} onClose={() => {}}>
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div
        className='fixed inset-0 bg-black/30 backdrop-blur-md'
        aria-hidden='true'
      />

      {chat && <StudentModelMain chat={chat} onClose={onClose} />}
    </Dialog>
  );
}

function StudentModelMain({
  chat,
  onClose
}: {
  chat: ChatHandle;
  onClose: VoidCallback;
}) {
  return (
    <div className='fixed inset-0 overflow-y-auto'>
      {/* Full-screen container to center the panel */}
      <div className='flex min-h-full items-center justify-center p-4'>
        {/* The actual dialog panel  */}
        <Dialog.Panel
          id='th-msgs-modal'
          className='mx-auto w-[90vw] max-w-[800px] rounded-2xl bg-white px-10 pb-9 pt-4'
        >
          <Dialog.Title className='-mx-6 flex justify-end'>
            <img
              onClick={() => onClose()}
              src={CrossIcon}
              className='box-content h-7 w-7 cursor-pointer rounded-lg p-2 transition-colors hover:bg-black/10'
            />
          </Dialog.Title>
          <div className='flex items-center'>
            <img className='h-20 w-20' src={resolveUserPfp(chat.user)} />
            <div className='ml-4 select-none space-y-1'>
              <p className='text-xl font-bold'>{fullname(chat.user)}</p>
              <p className='text-sm text-[#6b6a6a]'>
                Student ID: {chat.user.app_id}
              </p>
            </div>
            <div className='ml-auto space-y-2'>
              <div className='flex items-center'>
                <img src={CountryIcon} className='h-5 w-5' />
                <span className='ml-2 font-semibold'>
                  {chat.user.location || "N/A"}
                </span>
                <img src={EmailIcon} className='ml-4 h-5 w-5' />
                <span className='ml-2 font-semibold'>{chat.user.email}</span>
              </div>
              <div className='flex items-center justify-end gap-x-1 text-[#4C4C4C]'>
                <span>{chat.cohort.program.name}</span>
                <div className='mx-2 h-[5px] w-[5px] rounded-full bg-[#CECECE]' />
                <span>{chat.cohort.app_id}</span>
              </div>
            </div>
          </div>
          <StudentModelStats chat={chat} />
        </Dialog.Panel>
      </div>
    </div>
  );
}

function StudentModelStats({ chat }: { chat: ChatHandle }) {
  let { user: student, cohort } = chat;

  const { data: user, isLoading: badgesLoading } = useGetUser(student.id);
  const badges = user?.badges ?? [];
  const numBages = badges.length;

  let enrollmentStudent = cohort.students.find(
    (st: any) => st.user.id === student.id
  );

  return (
    <>
      <section className='mt-10 grid auto-rows-[1fr] grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2'>
        <div id='st-progress-grad-1' className='rounded-lg px-8 pt-6'>
          <header className='flex items-start justify-between'>
            <h2 className='text-xl font-bold'>Badges Earned</h2>
            <button className='w-button w-button-outline invisible text-sm'>
              View All
            </button>
          </header>
          <div className='-mt-1 flex items-center gap-x-12'>
            <img className='h-28 w-28 -translate-y-3' src={BadgesEarnedIMG} />
            <span className='text-5xl font-bold'>{numBages}</span>
          </div>
        </div>
        <div id='st-progress-grad-2' className='rounded-lg px-8 pt-6'>
          <header className='flex items-start justify-between'>
            <h2 className='text-xl font-bold'>Modules Completed</h2>
            <button className='w-button w-button-outline invisible text-sm'>
              View All
            </button>
          </header>
          <div className='-mt-1 flex items-center gap-x-12'>
            <img
              className='ml-16 h-28 w-28 -translate-y-3 scale-75'
              src={ModulesCompletedIMG}
            />
            <span className='text-5xl font-bold'>
              {enrollmentStudent.completions.length}
            </span>
          </div>
        </div>
        <div className='relative'>
          <div
            id='st-progress-grad-3'
            className='w-full rounded-lg px-8 py-6 lg:absolute lg:left-1/2'
          >
            <header className='flex items-start justify-between'>
              <h2 className='text-xl font-bold'>Learning Time</h2>
            </header>
            <div className='-mt-1 flex items-center gap-x-12'>
              <img className='ml-16 h-28 w-28' src={LearningTimeIMG} />
              <span className='text-5xl font-bold'>
                {studentLearningTime(enrollmentStudent)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
