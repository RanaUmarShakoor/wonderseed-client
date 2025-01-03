import SendIcon from "./images/send.svg";
import { memo, useEffect, useRef, useState } from "react";
import { useAppStoreKey } from "stores/main";
import { apiConn } from "apiconn";
import { produce } from "immer";
import { ChatMessage } from "./ChatMessage";
import { ChatHandle } from "./common";

export const ChatWindow = memo(({ chat }: { chat: ChatHandle }) => {
  const auth = useAppStoreKey("auth");
  const selfId = auth.user?.id;

  const inputRef = useRef<HTMLInputElement>(null);
  const msgboxRef = useRef<HTMLDivElement>(null);

  const [msgs, setMsgs] = useState<any[]>([]);

  const rescroll = () => {
    msgboxRef.current &&
      (msgboxRef.current.scrollTop = msgboxRef.current.scrollHeight);
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    async function func() {
      let resp = await apiConn.post(`/chat/messages`, {
        user_one_id: selfId,
        user_two_id: chat.user.id,
        cohort_id: chat.cohort.id
      });

      let { content: msglist } = resp.data;
      setMsgs(msglist);
    }
    setMsgs([]);
    func();
  }, [chat]);

  useEffect(rescroll, [msgs]);

  async function sendMessage() {
    let content = inputRef?.current?.value ?? "";
    let resp = await apiConn.post(`/chat/send-message`, {
      sender_id: selfId,
      receiver_id: chat.user.id,
      cohort_id: chat.cohort.id,
      content: content
    });

    let message = resp.data.content;

    setMsgs(
      produce(list => {
        list.push(message);
      })
    );

    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section id='th-chat-window'>
      <div ref={msgboxRef} className='message-list'>
        {msgs.map(msg => (
          <ChatMessage
            key={msg.id}
            source={msg.sender === selfId ? "self" : "other"}
          >
            {msg.content}
          </ChatMessage>
        ))}
      </div>
      <form
        id='message-bar'
        onSubmit={event => {
          sendMessage();
          event.preventDefault();
          return false;
        }}
      >
        <input ref={inputRef} placeholder='Write a message' size={1} />
        <button type='submit' id='send-btn'>
          <img src={SendIcon} />
        </button>
      </form>
    </section>
  );
});
