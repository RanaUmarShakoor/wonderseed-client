import { Route, Routes } from "react-router-dom";
import { StudentInfoSideView } from "./StudentInfoSideView";
import { TopNav } from "./TopNav";
import { KnowledgeBase } from "features/knowledgebase/KnowledgeBase";
import { FAQs } from "features/knowledgebase/FAQs";
import { redirectTo } from "utils";

export function KnowledgeBaseRoutes() {
  return (
    <>
      <StudentInfoSideView />
      <div className='sideview-content-sheet'>
        <TopNav />
        <div className='sideview-content'>
          <Routes>
            <Route path='*' Component={redirectTo("knowledge-base")} />
            <Route path='knowledge-base' Component={KnowledgeBase} />
            <Route path='knowledge-base/faqs' Component={FAQs} />
          </Routes>
        </div>
      </div>
    </>
  );
}
