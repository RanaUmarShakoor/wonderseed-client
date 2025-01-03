import IconProfile from "./views-icons/profile.png";
import IconMessages from "./views-icons/messages.png";
import IconBatches from "./views-icons/batches.png";
import IconFaqs from "./views-icons/faqs.png";

import { SidebarLink, SidebarLinks } from "components/SideView/SidebarLink";
import { SimpleSidebar } from "components/SideView/SimpleSidebar";

export function Sidebar() {
  return (
    <SimpleSidebar>
      <SidebarLinks>
        <SidebarLink to='/t/profile' iconURL={IconProfile} label='Profile' />
        <SidebarLink to='/t/messages' iconURL={IconMessages} label='Messages' />
        <SidebarLink to='/t/batches' iconURL={IconBatches} label='Programs' />
        <SidebarLink to='/t/knowledge-base' iconURL={IconFaqs} label='FAQs' />
      </SidebarLinks>
    </SimpleSidebar>
  );
}
