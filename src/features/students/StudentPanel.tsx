import "./StudentPanel.scss";
import { Route, Routes, useNavigate } from "react-router-dom";
import { redirectTo } from "utils";
import { MyProgess } from "./MyProgess";
import { LearnerView } from "./LearnerView/LearnerView";
import { ProgramCompleted } from "./ProgramCompleted";
import { Certificate } from "./Certificate";
import { KnowledgeBaseRoutes } from "./KnowledgeBaseRoutes";
import { Profile } from "./Profile";
import { WelcomePage } from "./WelcomePage/WelcomePage";
import { Preassessment } from "./Preassessment";
import { StudentChat } from "./StudentChat";
import { useAppStoreKey } from "stores/main";
import { useEffect } from "react";
import { ChooseProgramView } from "./ChooseProgram";

function PickRedirection() {
  const firstLogin = useAppStoreKey("firstLogin");
  const setFirstLogin = useAppStoreKey("setFirstLogin");
  const cohortConfirmed = useAppStoreKey("cohortConfirmed");
  const navigate = useNavigate();

  useEffect(() => {
    let url: string;

    if (cohortConfirmed) {
      url = firstLogin ? "/s/profile" : "/s/program/welcome";
    } else {
      url = "/s/choose-program";
    }

    setFirstLogin(false);
    navigate(url);
  }, []);

  return null;
}

function ProtectConfirmed({ Comp }: { Comp: React.ComponentType }) {
  const navigate = useNavigate();
  const cohortConfirmed = useAppStoreKey("cohortConfirmed");

  useEffect(() => {
    if (!cohortConfirmed) {
      navigate("/s/choose-program");
    }
  }, [cohortConfirmed]);

  if (cohortConfirmed) return <Comp />;
  else return undefined;
}

export default function StudentPanel() {
  return (
    <div id='panel-students'>
      <Routes>
        <Route path='/' Component={PickRedirection} />
        <Route path='choose-program' Component={ChooseProgramView} />

        <Route path='program/welcome' element={<ProtectConfirmed Comp={WelcomePage} />} />
        <Route path='program/program-completed' element={<ProtectConfirmed Comp={ProgramCompleted} />} />
        <Route path='program/preassessment' element={<ProtectConfirmed Comp={Preassessment} />} />
        <Route path='program/certificate' element={<ProtectConfirmed Comp={Certificate} />} />
        <Route path='program/*' element={<ProtectConfirmed Comp={LearnerView} />} />
        <Route path='progress/*' element={<ProtectConfirmed Comp={MyProgess} />} />
        <Route path='profile' Component={Profile} />
        <Route path='info/*' Component={KnowledgeBaseRoutes} />
        <Route path='chat/*' element={<ProtectConfirmed Comp={StudentChat} />} />
      </Routes>
    </div>
  );
}
