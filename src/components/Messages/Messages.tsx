import "./Messages.scss";
import MessagesTitle from "./images/messages-title.png";

import { useState } from "react";
import cx from "classnames";
import { ParamVoidCallback, resolveUserPfp } from "utils";
import { ChatList } from "./ChatList";
import { ChatHandle, fullname } from "./common";
import { ChatWindow } from "./ChatWindow";

export function Messages({
  chatlist = [],
  onUserInfo
}: {
  chatlist?: ChatHandle[];
  onUserInfo?: ParamVoidCallback<ChatHandle>;
}) {
  const [chat, setChat] = useState<ChatHandle | null>(null);

  async function onChatSelected(newChat: ChatHandle) {
    // if (
    // chat?.cohort.id != newChat.cohort.id ||
    // chat?.user.id != newChat.user.id
    // )
    // setChat(newChat);
    setChat({ ...newChat });
  }

  return (
    <>
      <div className='grid h-full grid-cols-1 grid-rows-[auto_autoo_1fr_auto] bg-white lg:grid-cols-[auto_1fr] lg:grid-rows-[auto_1fr]'>
        {/* The first cell for the "Messages" heading */}
        <section className='flex items-center justify-between py-4 pl-11 pr-5'>
          <h1 className='mr-24 text-4xl font-bold'>Messsages</h1>
          <img src={MessagesTitle} className='h-16 w-16' />
        </section>
        {/* 2nd cell for the student profile */}
        <section className='flex items-center pl-7 pr-11'>
          <div
            onClick={() => chat && onUserInfo?.(chat)}
            className={cx(
              "flex items-center self-stretch px-4 transition-colors",
              chat && "cursor-pointer hover:bg-green-1/10"
            )}
          >
            {chat && (
              <>
                <img className='h-14 w-14' src={resolveUserPfp(chat.user)} />
                <span className='ml-6 select-none text-2xl font-bold'>
                  {fullname(chat.user)}
                </span>
              </>
            )}
          </div>
          <div className='ml-auto flex gap-x-8 text-[#4C4C4C]'>
            <span>{chat?.cohort.program.name}</span>
            <span>{chat?.cohort.app_id}</span>
          </div>
        </section>
        {/* 3rd cell for chat list */}
        <ChatList onChatSelected={onChatSelected} chatlist={chatlist} />
        {/* 4th cell for the chat itself */}
        {chat !== null ? (
          <ChatWindow chat={chat} />
        ) : (
          <div className='pin-center text-2xl text-[#696969] opacity-70'>
            Open a chat from left
          </div>
        )}
      </div>
    </>
  );
}
