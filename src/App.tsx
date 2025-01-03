import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";
import "./global.css";

import "./components/floating-input.scss";
import "./components/button.scss";
import "./components/page-back-btn.scss";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react";

import { Login } from "features/auth/Login";
import { ResetPassword } from "features/auth/ResetPassword";
import { RedeemResetPassword } from "features/auth/RedeemResetPassword";
import { Landing } from "features/landing/Landing";
import { lazyload } from "components/loadable";
import { useAppStore, useAppStoreKey } from "stores/main";
import { NotFound } from "./NotFound";
import { Role } from "role";
import { apiConn, setUploadUrl } from "apiconn";
import { ExpandedSpinner } from "components/Spinner";

const TeacherPanel = lazyload(() => import("features/teachers/TeacherPanel"));
const StudentPanel = lazyload(() => import("features/students/StudentPanel"));
const ManageView = lazyload(() => import("features/manage/Manage"));

function ProtectedRoute({
  Comp,
  roles
}: {
  Comp: React.ComponentType;
  roles: string[];
}) {
  const navigate = useNavigate();
  const role = useAppStore(store => store.auth.user?.role);

  let pass = useMemo(() => {
    for (let i = 0; i < roles.length; ++i)
      // ...
      if (role === roles[i])
        // ...
        return true;
    // ...
    return false;
  }, [roles]);

  useEffect(() => {
    if (!pass) {
      navigate("/login");
    }
  }, [pass]);

  if (pass) return <Comp />;
  else return undefined;
}

function Logout() {
  const navigate = useNavigate();
  const loggedOut = useAppStoreKey("loggedOut");

  useEffect(() => {
    loggedOut();
    setTimeout(() => navigate("/login"), 0);
  }, []);

  return null;
}

function ApplicationRoutes() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    document
      .querySelectorAll(".sideview-content")
      .forEach(elem => elem.scrollTo(0, 0));
  }, [pathname]);

  return (
    <Routes>
      <Route path='/' Component={Landing} />
      <Route path='/login' Component={Login} />
      <Route path='/logout' Component={Logout} />
      <Route path='/reset-password' Component={ResetPassword} />
      <Route path='/redeem-reset-password' Component={RedeemResetPassword} />
      <Route
        path='/t/*'
        // element={<TeacherPanel />}
        element={<ProtectedRoute Comp={TeacherPanel} roles={[Role.Teacher]} />}
      />
      <Route
        path='/s/*'
        element={
          <ProtectedRoute
            Comp={StudentPanel}
            roles={[Role.Student, Role.Coach]}
          />
        }
        // element={<StudentPanel />}
      />
      <Route
        path='/m/*'
        // element={<ManageView />}
        element={
          <ProtectedRoute
            Comp={ManageView}
            roles={[Role.SuperAdmin, Role.ProgramAdmin, Role.Researcher]}
          />
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: failureCount =>
        Math.min(Math.pow(2, failureCount) * 1000, 24000),
      retry: 3,
      networkMode: "always"
    }
  }
});

export const App = () => {
  let [ready, setReady] = useState(false);
  useEffect(() => {
    async function f() {
      setUploadUrl("");
      try {
        let resp = await apiConn.get("/uploads-url-endpoint");
        setUploadUrl(resp.data.content);
      } finally {
        setReady(true);
      }
    }
    f();
  }, []);

  if (!ready)
    return <ExpandedSpinner />

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ApplicationRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
