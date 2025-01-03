import { apiConn } from "apiconn";
import cx from "classnames";
import { ExpandedSpinner } from "components/Spinner";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Ellipsis } from "react-css-spinners";
import { Link, useSearchParams } from "react-router-dom";

export function RedeemResetPassword() {
  const [params] = useSearchParams();
  let token = params.get("token");
  let [isTokenClean, setIsTokenClean] = useState<boolean | "waiting">(
    "waiting"
  );

  const [flowStage, setFlowStage] = useState<
    "idle" | "loading" | "completed" | "error"
  >("idle");
  const loading = flowStage === "loading";
  const showFlowError = useCallback((msg: string) => {
    setFlowStage("error");
    setMessage(msg);
  }, []);
  const [message, setMessage] = useState("");

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    async function validate() {
      setIsTokenClean("waiting");
      try {
        let resp = await apiConn.post("/rpw/validate", { token });
        setIsTokenClean(!!(resp.data?.content || false));
      } catch {
        setIsTokenClean(false);
      }
    }
    validate();
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (flowStage === "loading" || !(isTokenClean === true))
      //
      return;

    if (newPass !== confirmPass)
      //
      return showFlowError("Passwords do not match.");

    if (newPass === "")
      //
      return showFlowError("Password cannot be empty.");

    setFlowStage("loading");
    try {
      let resp = await apiConn.post("/rpw/redeem", {
        token,
        password: newPass
      });
      if (resp.data.status === "success") {
        setFlowStage("completed");
      } else {
        showFlowError(resp.data.message);
      }
    } catch {
      showFlowError("An error occuered.");
    }
  }

  let content: ReactNode;
  if (isTokenClean === "waiting")
    content = (
      <div className='mt-40'>
        <ExpandedSpinner />
      </div>
    );
  else if (!isTokenClean)
    content = (
      <div className='mt-40'>
        <p className='text-lg font-bold text-red-500'>
          This link is invalid or expired.
        </p>
      </div>
    );
  else if (flowStage === "completed")
    content = (
      <div className='mt-40'>
        <p className='text-lg font-bold text-teal-500'>
          Your password has been reset.
        </p>
      </div>
    );
  else
    content = (
      <section className='mb-10 mt-16 md:mt-36 lg:ml-20 xl:ml-28'>
        <h1 className='mb-6 text-lg font-black xs:text-2xl md:mb-10 md:text-3xl lg:text-4xl'>
          Change Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className='floating-input mb-6 md:w-96'>
            <input
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder=' '
              required
              size={1}
              type='password'
            />
            <label>New Password</label>
          </div>
          <div className='floating-input mb-6 md:w-96'>
            <input
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              placeholder=' '
              required
              size={1}
              type='password'
            />
            <label>Confirm New Password</label>
          </div>
          <div className='flex flex-col items-start gap-x-10 gap-y-6 md:flex-row md:items-center'>
            <button
              disabled={loading}
              type='submit'
              className={cx("w-button w-full sm:w-auto", loading && "!py-1")}
            >
              {loading ? <Ellipsis size={32} /> : <>Submit</>}
            </button>
          </div>
          {flowStage === "error" && (
            <div className={cx("mt-3 text-lg font-bold text-red-500")}>
              {message}
            </div>
          )}
        </form>
      </section>
    );

  return (
    <div id='lg-sheet' className='px-8 py-10 md:pl-20 md:pr-0'>
      <Link to='/'>
        <img src='/logo-name.png' className='h-28 w-28' />
      </Link>
      <div className='flex flex-col md:flex-row'>{content}</div>
    </div>
  );
}
