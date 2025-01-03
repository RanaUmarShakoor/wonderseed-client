import cx from "classnames";
import { Ellipsis } from "react-css-spinners";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useLayoutEffect, useState } from "react";
import { apiConn } from "apiconn";
import { useAppStore } from "stores/main";

export function ResetPassword() {
  const navigate = useNavigate();
  const isAuthenticated = useAppStore(store => store.auth.isAuthenticated);

  let [reply, setReply] = useState<any>({ status: "idle" });
  let [email, setEmail] = useState("");

  useLayoutEffect(() => {
    if (isAuthenticated)
      //
      navigate("/login");
  }, [isAuthenticated]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setReply({ status: "loading" });

    let resp;

    try {
      let raw = await apiConn.post("/rpw/new", {
        userEmail: email
      });
      resp = raw.data;
    } catch (err) {
      console.log("An error occured", err);
      resp = { status: "failure", message: "An error occured" };
    }

    if (resp.status === "success") {
      setReply({
        status: "success",
        message: "Password reset link sent to email. Check your inbox."
      });
    } else {
      setReply(resp);
    }
  }

  if (isAuthenticated) return null;

  let loading = reply.status === "loading";

  return (
    <div id='lg-sheet' className='px-8 py-10 md:pl-20 md:pr-0'>
      <Link to='/'>
        <img src='/logo-name.png' className='h-28 w-28' />
      </Link>
      <div className='flex flex-col md:flex-row'>
        <section className='mb-10 mt-16 md:mt-36 lg:ml-20 xl:ml-28'>
          <h1 className='mb-6 text-lg font-black xs:text-2xl md:mb-10 md:text-3xl lg:text-4xl'>
            Reset Your Password
          </h1>
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
            <div className='flex flex-col items-start gap-x-10 gap-y-6 md:flex-row md:items-center'>
              <button
                disabled={loading}
                type='submit'
                className={cx("w-button w-full sm:w-auto", loading && "!py-1")}
              >
                {loading ? <Ellipsis size={32} /> : <>Submit</>}
              </button>
            </div>
            {reply.message && (
              <div
                className={cx(
                  "mt-3 text-lg font-bold",
                  reply.status === "failure" ? "text-red-500" : "text-teal-500"
                )}
              >
                {reply.message}
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
