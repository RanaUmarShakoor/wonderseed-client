import "./TeacherPanel.scss";

import { Sidebar } from "./Sidebar";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { TeacherProfile } from "./Profile";
import { TeacherChat } from "./TeacherChat";
import { Batches } from "./Batches";
import { Cohorts } from "./Cohorts";
import { CohortProgress } from "./CohortProgress";

import { KnowledgeBase } from "features/knowledgebase/KnowledgeBase";
import { FAQs } from "features/knowledgebase/FAQs";
import { redirectTo } from "utils";

export default function TeacherPanel() {
  return (
    <>
      <div id='panel-teachers'>
        <Sidebar />
        <div className='sideview-content-sheet'>
          <p className='mt-10 text-right text-sm font-bold text-black opacity-[0.53]'>
            Your Facilitator Dashboard
          </p>
          <Routes>
            <Route path='/' Component={redirectTo("profile")} />

            <Route path='profile' Component={TeacherProfile} />

            <Route path='messages' Component={TeacherChat} />

            <Route path='batches' Component={Batches} />
            <Route path='batches/chorts/:programId' Component={Cohorts} />
            <Route
              path='batches/chort-progress/:cohortId'
              Component={CohortProgress}
            />

            <Route path='knowledge-base' Component={KnowledgeBase} />
            <Route path='knowledge-base/faqs' Component={FAQs} />
          </Routes>
        </div>
      </div>
    </>
  );
}
