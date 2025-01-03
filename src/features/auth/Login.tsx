import "./Login.scss";
import cx from "classnames";
import BgIllustration from "./images/bg-illustration.png";
import { Ellipsis, Roller } from "react-css-spinners";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { apiConn } from "apiconn";
import { useAppStore, useAppStoreKey } from "stores/main";
import { Role } from "role";

function redirectToPanel(navigate: NavigateFunction, role: Role | undefined) {
  if (role === Role.Student || role === Role.Coach) {
    navigate("/s");
  } else if (role === Role.Teacher) {
    navigate("/t");
  } else if (
    [Role.SuperAdmin, Role.ProgramAdmin, Role.Researcher].includes(role!)
  ) {
    navigate("/m");
  }
}

function LoginForm() {
  const navigate = useNavigate();
  const authenticated = useAppStoreKey("authenticated");
  const setFirstLogin = useAppStoreKey("setFirstLogin");
  const [role, isAuthenticated] = useAppStore(store => [
    store.auth.user?.role,
    store.auth.isAuthenticated
  ]);

  let [reply, setReply] = useState<any>({ status: "idle" });

  let [codeBoxOpen, setCodeBoxOpen] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [cohortCode, setCohortCode] = useState("");

  let userDataRef = useRef<any>({});

  // /*
  useLayoutEffect(() => {
    if (isAuthenticated)
      // ...
      redirectToPanel(navigate, role);
  }, [isAuthenticated]);
  // */

  async function dispatchLogin(payload: any) {
    /*
    switch (payload.email) {
      case 's': return redirectToPanel(navigate, 'student');
      case 't': return redirectToPanel(navigate, 'teacher');
    }
    */
    setReply({ status: "loading" });
    let resp;
    try {
      let raw = await apiConn.post("/login", payload);
      resp = raw.data;
    } catch (err) {
      console.log("An error occured", err);
      resp = { status: "failure", message: "An error occured" };
    }

    if (resp.status === "success") {
      // User sucessfully logged in
      let { user, token, cohortId } = resp.content;
      cohortId = cohortId ?? null;

      let isStudent = user.role === Role.Student || user.role == Role.Coach;
      if (isStudent && cohortId === null) {
        userDataRef.current = { user, token };
        setCohortCode("");
        setCodeBoxOpen(true);
      } else {
        authenticated(user, token, cohortId);
      }
    } else {
      // Invalid creds / other error
      setReply(resp);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    (document.activeElement as any | null)?.blur();

    dispatchLogin({
      email,
      password
    });

    return false;
  }

  async function handleCodeSubmit() {
    try {
      let { user, token } = userDataRef.current;

      // let resp = await apiConn.get(`/cohort-app-id/${cohortCode}`);
      let resp = await apiConn.post(`/register-cohort-appid`, {
        app_id: cohortCode,
        student_id: user.id
      });

      let { cohortId } = resp.data.content;

      apiConn.post("/post-login", {
        user_id: user.id
      });

      authenticated(user, token, cohortId);
      setFirstLogin(user.last_login == undefined);
    } catch (e) {
      setReply({ status: "failure", message: "Invalid cohort code" });
      setCodeBoxOpen(false);
    }
  }

  if (isAuthenticated) return null;

  let loading = reply.status === "loading";

  return (
    <form onSubmit={handleSubmit}>
      <div className='floating-input mb-6 md:w-96'>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder=' '
          required
          size={1}
        />
        <label>Email</label>
      </div>
      <div className='floating-input mb-6 md:w-96'>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type='password'
          placeholder=' '
          // required
          size={1}
        />
        <label>Password</label>
      </div>
      <div className='flex flex-col items-start gap-x-10 gap-y-6 md:flex-row md:items-center'>
        <button
          disabled={loading}
          type='submit'
          className={cx("w-button w-full sm:w-auto", loading && "!py-1")}
        >
          {loading ? <Ellipsis size={32} /> : <>Login</>}
        </button>
        <Link
          to='/reset-password'
          // type='button'
          // onClick={() =>
          // alert("Please contact administration to reset your password")
          // }
          className='text-lg text-[#81AE38]'
        >
          Forgot Password?
        </Link>
      </div>
      {reply.status === "failure" && (
        <div className='mt-3 text-lg font-bold text-red-500'>
          {reply.message}
        </div>
      )}
      <Dialog open={codeBoxOpen} onClose={() => {}}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div
          className='fixed inset-0 bg-black/30 backdrop-blur-md'
          aria-hidden='true'
        />

        {/* Full-screen container to center the panel */}
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          {/* The actual dialog panel  */}
          <Dialog.Panel
            id='lg-codebox'
            className='mx-auto w-[400px] rounded-2xl bg-white px-10 py-9'
          >
            <Dialog.Title className='text-3xl font-bold'>
              Enter Cohort Code
            </Dialog.Title>
            <div className='floating-input mt-5'>
              <input
                className='!text-2xl !font-black'
                placeholder='E.g C1232'
                size={1}
                value={cohortCode}
                onChange={event => setCohortCode(event.currentTarget.value)}
              />
            </div>
            <Dialog.Description className='mt-5 text-lg opacity-70'>
              Contact your facilitator/coordinator for a Cohort code
            </Dialog.Description>
            <button onClick={handleCodeSubmit} className='w-button mt-6'>
              Continue
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </form>
  );
}

export function Login() {
  return (
    <div id='lg-sheet' className='px-8 py-10 md:pl-20 md:pr-0'>
      <Link to='/'>
        <img src='/logo-name.png' className='h-28 w-28' />
      </Link>
      <div className='flex flex-col md:flex-row'>
        <section className='mb-10 mt-16 md:mt-36 lg:ml-20 xl:ml-28'>
          <h1 className='mb-6 text-lg font-black xs:text-2xl md:mb-10 md:text-3xl lg:text-4xl'>
            Login to Your Dashboard
          </h1>
          <LoginForm />
        </section>
        <section className='flex-1 md:pl-10'>
          <img
            src={BgIllustration}
            className='w-full max-w-[650px] md:ml-auto'
          />
        </section>
      </div>
    </div>
  );
}
