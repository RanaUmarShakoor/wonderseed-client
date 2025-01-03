import { SideView } from "./SideView";
import { Link } from "react-router-dom";

import { CollapseButton } from "./CollapseButton";
import { SidebarLogoutButton } from "./SidebarLogoutButton";
import { PropsWithChildren } from "react";

export function SimpleSidebar({ children }: PropsWithChildren) {
  return (
    <SideView>
      <div>
        <Link
          to='/'
          className='h-28 w-28 shrink-0 self-start overflow-hidden rounded-full'
        >
          <img src='/logo-name.png' className='h-full w-full' />
        </Link>
        <CollapseButton />
        {children}
        <s className='grow' />
        <SidebarLogoutButton />
      </div>
    </SideView>
  );
}
