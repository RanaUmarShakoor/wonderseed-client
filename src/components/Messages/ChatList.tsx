import { ReactNode } from "react";
import { resolveUserPfp } from "utils";
import { ChatHandle, fullname } from "./common";
import { ChatEntry } from "./ChatEntry";

export function ChatList({
  chatlist,
  onChatSelected = () => {}
}: {
  // cohorts: any[];
  chatlist: ChatHandle[];
  onChatSelected?: (chat: ChatHandle) => void;
}) {
  let rows: ReactNode[] = [];
  for (let i = 0; i < chatlist.length; ++i) {
    let chat = chatlist[i];
    let { cohort, user } = chat;
    rows.push(
      <ChatEntry
        key={user.id + cohort.id}
        imgURL={resolveUserPfp(user)}
        name={fullname(user)}
        cohortName={cohort.app_id}
        onClick={() => onChatSelected(chat)}
      />
    );
  }

  return (
    <section className='row-[4] overflow-y-auto bg-white lg:row-[2]'>
      {rows}
    </section>
  );
}
