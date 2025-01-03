import "./Manage.scss";
import { redirectTo } from "utils";
import { Route, Routes } from "react-router-dom";
import { ManageSidebar } from "./ManageSidebar";
import { lazyload } from "components/loadable";

const ManageUsers = lazyload(() => import("./users/ManageUsers"));
const ManagePrograms = lazyload(() => import("./programs/ManagePrograms"));
const ManageCohorts = lazyload(() => import("./cohorts/ManageCohorts"));
const ManageBadges = lazyload(() => import("./badges/ManageBadges"));
const ManageGuides = lazyload(() => import("./guides/ManageGuides"));

export default function ManageView() {
  return (
    <div
      id='manage-panel'
      className='flex max-h-full min-h-full min-w-full max-w-full'
    >
      <ManageSidebar />
      <div className='sideview-content-sheet'>
        <div className='sideview-content !mt-0'>
          <Routes>
            <Route path='/' Component={redirectTo("users")} />
            <Route path='users/*' Component={ManageUsers} />
            <Route path='programs/*' Component={ManagePrograms} />
            <Route path='cohorts/*' Component={ManageCohorts} />
            <Route path='badges/*' Component={ManageBadges} />
            <Route path='guides/*' Component={ManageGuides} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
