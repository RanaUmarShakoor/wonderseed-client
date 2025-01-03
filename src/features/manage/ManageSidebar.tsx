import { SidebarLink, SidebarLinks } from "components/SideView/SidebarLink";
import { SimpleSidebar } from "components/SideView/SimpleSidebar";
import { Role } from "role";
import { useAppStoreKey } from "stores/main";

let baseUrl = "/m/";

export function ManageSidebar() {
  const { user } = useAppStoreKey("auth");
  const role = user?.role;

  return (
    <SimpleSidebar>
      <SidebarLinks>
        <SidebarLink
          data-no-active-collapsed
          matchBaseUrl={baseUrl}
          to='users'
          label='Users'
        />
        <SidebarLink
          data-no-active-collapsed
          matchBaseUrl={baseUrl}
          to='programs'
          label='Programs'
        />
        <SidebarLink
          data-no-active-collapsed
          matchBaseUrl={baseUrl}
          to='cohorts'
          label='Cohorts'
        />
        {role === Role.SuperAdmin && (
          <>
            <SidebarLink
              data-no-active-collapsed
              matchBaseUrl={baseUrl}
              to='badges'
              label='Badges'
            />
            <SidebarLink
              data-no-active-collapsed
              matchBaseUrl={baseUrl}
              to='guides'
              label='Knowledge Base'
            />
          </>
        )}
      </SidebarLinks>
    </SimpleSidebar>
  );
}
