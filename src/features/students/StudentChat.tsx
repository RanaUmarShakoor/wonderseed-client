import { Messages } from "components/Messages/Messages";
import { StudentInfoSideView } from "./StudentInfoSideView";
import { TopNav } from "./TopNav";
import { ExpandedSpinner } from "components/Spinner";
import { ChatHandle } from "components/Messages/common";
import { useAppStoreKey } from "stores/main";
import { useGetCohort, useGetUser } from "apiconn";

export function StudentChat() {
  const auth = useAppStoreKey("auth");

  const { data: cohort, isSuccess: cohortLoaded } = useGetCohort(auth.cohortId);
  const { data: teacher, isLoading: teacherLoading } = useGetUser(
    cohort?.teacher,
    {
      enabled: cohortLoaded && !!cohort.teacher
    }
  );

  if (teacherLoading) return <ExpandedSpinner flex />;

  return (
    <>
      <StudentInfoSideView />
      <div className='sideview-content-sheet'>
        <TopNav />
        <div className='sideview-content !pb-0 !pr-0 pt-3.5'>
          <Messages chatlist={[{ cohort, user: teacher }]} />
        </div>
      </div>
    </>
  );
}
