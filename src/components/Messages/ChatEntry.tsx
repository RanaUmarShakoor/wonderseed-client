import { VoidCallback } from "utils";

export function ChatEntry({
  name,
  cohortName,
  // unreadCount,
  imgURL,
  onClick
}: {
  name: string;
  cohortName: string;
  // unreadCount?: number;
  imgURL: string;
  onClick: VoidCallback;
}) {
  return (
    <div
      onClick={onClick}
      className='flex cursor-pointer items-center border-b border-[#E6E6E6] py-5 pl-11 pr-11 transition-colors hover:bg-green-1/[0.1]'
    >
      <img src={imgURL} className='h-14 w-14' />
      <div className='ml-6 select-none'>
        <p className='text-lg text-black'>{name}</p>
        {/* <p className='text-[#696969]'>30 mins</p> */}
        <p className='text-[#696969]'>{cohortName}</p>
      </div>
      {/* {unreadCount && unreadCount !== 0 && ( */}
      {/* <div className='pin-center ml-auto h-7 w-7 self-start rounded-full bg-[#E1EBD0]'> */}
      {/* <span className='text-base font-black text-black'>{unreadCount}</span> */}
      {/* </div> */}
      {/* )} */}
    </div>
  );
}
