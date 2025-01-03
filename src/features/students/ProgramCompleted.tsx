import { Link, useNavigate } from "react-router-dom";
import { TopNav } from "./TopNav";
import { useStudentCohort, useStudentEnrollment } from "utils";
import { ExpandedSpinner } from "components/Spinner";
import { useEffect, useState } from "react";
import { apiConn } from "apiconn";
import { Ellipsis } from "react-css-spinners";

export function ProgramCompleted() {
  const navigate = useNavigate();
  const { cohort, data: enrollment, isLoading } = useStudentEnrollment();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isLoading || !enrollment)
      //
      return;

    if (enrollment.cert_generated !== true)
      //
      return;

    const params = new URLSearchParams();
    params.set("firstName", enrollment.cert_first_name || "");
    params.set("lastName", enrollment.cert_last_name || "");

    navigate({
      pathname: "/s/program/certificate",
      search: params.toString()
    });

  }, [enrollment, isLoading]);

  const onSubmit = async event => {
    event.preventDefault();
    if (!first || !last) return;
    setUploading(true);

    try {
      const params = new URLSearchParams();
      params.set("firstName", first);
      params.set("lastName", last);

      let data = {
        cohort_id: cohort.id,
        student_id: enrollment.user.id,
        cert_first_name: first,
        cert_last_name: last
      };

      await apiConn.post("/apply-cert-name", data);

      navigate({
        pathname: "/s/program/certificate",
        search: params.toString()
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading)
    //
    return <ExpandedSpinner flex />;

  let h1_classes = "text-2xl lg:text-3xl xl:text-4xl font-bold text-[#193A32]";
  return (
    <main className='relative flex h-screen w-screen flex-col overflow-x-hidden'>
      <div className='flex items-center justify-between px-8'>
        <Link to='/s' className='shrink-0'>
          <img src='/logo-name.png' className='relative top-5 h-28 w-28' />
        </Link>
        <TopNav />
      </div>
      <section className='relative mt-10 flex flex-1 flex-col md:flex-row'>
        <div className='flex flex-1 justify-center px-6 py-6 md:flex-row-reverse md:justify-start lg:px-16 xl:w-[58%]'>
          <div className='flex items-center'>
            <div className='relative -top-5 flex flex-col gap-y-8 md:-top-16 lg:gap-y-12 xl:gap-y-16'>
              <div className='flex flex-col gap-y-3 lg:gap-y-5'>
                <h1 className={h1_classes}>
                  Congratulations,
                  <span className='ms-1 inline-block w-[86px]'>
                    <img src='/third/Celebration_img.png' />
                  </span>
                </h1>
                <h1 className={h1_classes}>
                  You've completed {cohort?.program.name}
                </h1>
              </div>
              <form onSubmit={onSubmit} className='flex flex-col gap-y-6'>
                <h2 className='text-xl font-bold text-[#193A32]'>
                  Preferred Name on the Certificate
                </h2>
                <div className='flex w-4/5 flex-col gap-y-4'>
                  <div className='floating-input md:w-96'>
                    <input
                      value={first}
                      onChange={event => setFirst(event.currentTarget.value)}
                      placeholder=' '
                      required
                      size={1}
                    />
                    <label>First Name</label>
                  </div>
                  <div className='floating-input md:w-96'>
                    <input
                      value={last}
                      onChange={event => setLast(event.currentTarget.value)}
                      placeholder=' '
                      required
                      size={1}
                    />
                    <label>Last Name</label>
                  </div>
                </div>
                <div className='flex flex-col gap-y-3'>
                  <button
                    disabled={uploading}
                    type='submit'
                    className='w-button self-start'
                  >
                    {uploading ? <Ellipsis size={20} /> : "Submit"}
                  </button>
                  <p className='text-base text-red-600'>
                    *This cannot be changed later
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className='relative mt-10 flex flex-1 items-center overflow-hidden'>
          <img
            src='/third/Background_img.png'
            className='-right-[20%] mt-10 w-full object-contain mix-blend-multiply lg:-bottom-[5%] lg:mt-6 lg:h-full xl:absolute'
          />
        </div>
      </section>
    </main>
  );
}
