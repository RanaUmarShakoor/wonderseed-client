import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiConn,
  callApiGet,
  useGetBadges,
  useGetModule,
  useGetProgram
} from "apiconn";
import { BackArrowButton } from "components/BackArrowButton";
import { ImageDropBlock } from "components/ImageDropBlock";
import { ExpandedSpinner } from "components/Spinner";
import { useCallback, useEffect, useState } from "react";
import { Ellipsis } from "react-css-spinners";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FileResourceHandle,
  eventsett,
  uploadFile,
  useMediaUpload
} from "utils";

function ModuleDayList({ module_ }: { module_: any }) {
  return (
    <div className='mt-8'>
      <header className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Days</h2>
        <Link to={`../day/new/${module_.id}`} className='w-button'>
          Add Day
        </Link>
      </header>
      {/* The table */}
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-green-1 text-xs uppercase text-white'>
            <tr className='whitespace-nowrap [&>th]:px-6 [&>th]:py-3'>
              <th>Day</th>
              <th>Name</th>
              <th>Super Power</th>
              <th>Purpose</th>
              <th>
                <span className='sr-only'></span>
              </th>
            </tr>
          </thead>
          <tbody className='text-gray-900'>
            {module_.days.map((day: any, index: number) => (
              <tr
                key={day.id}
                className='border-b bg-white hover:bg-gray-50 [&>td]:px-6 [&>td]:py-3'
              >
                <td className='font-medium'>{day.serial_num}</td>
                <td>{day.name}</td>
                <td>{day.super_power}</td>
                <td>{day.purpose}</td>
                <td className='whitespace-nowrap'>
                  <div className='flex items-center justify-end gap-x-3'>
                    <Link
                      to={`../day/${day.id}`}
                      className='font-medium text-blue-600 hover:underline'
                    >
                      Edit
                    </Link>
                    {/*
                    <a
                      href='#'
                      className='font-medium text-red-600 hover:underline'
                    >
                      Delete
                    </a>
                     */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ModuleIndexView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm();
  const [uploading, setUploading] = useState(false);

  let { moduleId, programId } = useParams();
  let updating = moduleId !== undefined;

  const { data: module_, isSuccess: moduleLoaded } = useGetModule(moduleId, {
    enabled: updating
  });

  let backedModuleAvailable = updating && moduleLoaded;

  useEffect(() => {
    if (!backedModuleAvailable)
      //
      return;

    setValue("completion_badge", module_.completion_badge);
    setValue("publish", module_.status === "published");
    // if (module_.character) hydrateWith(module_.character);
  }, [moduleId, moduleLoaded]);

  if (backedModuleAvailable)
    //
    programId = module_.program_id;

  const { data: program, isSuccess: programLoaded } = useGetProgram(programId, {
    enabled: programId !== undefined
  });

  /* =============== badges =============== */

  const { data: badges, isSuccess: badgesLoaded } = useGetBadges();

  // /* =============== Character Image =============== */

  // const { file, preview, onDrop, hydrateWith, hyrdationState, mode } =
  //   useMediaUpload();

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: {
  //     "image/*": [".png", ".jpg", ".jpeg"]
  //   }
  // });

  /* =============== submit =============== */

  const onSubmit: SubmitHandler<any> = useCallback(
    async data => {
      setUploading(true);
      try {
        // let handle: FileResourceHandle;
        // if (mode === "local") {
        //   if (file === null) return alert("Image missing");

        //   handle = await uploadFile(file, "module-character");
        // } else {
        //   handle = hyrdationState!;
        // }

        let { completion_badge, publish } = data;
        publish = !!publish;

        if (!completion_badge) return alert("Please select a badge");

        let server_data = {
          completion_badge,
          publish,
          // character: handle.id
        };

        let url = updating
          ? `/modules/update/${moduleId}`
          : `/modules/create/${programId}`;

        let resp = await apiConn.post(url, server_data);

        if (resp.data.status === "success") {
          if (updating)
            queryClient.invalidateQueries({ queryKey: ["module", moduleId] });

          navigate(-1);
        } else {
          alert("An error occured");
          console.log(resp.data);
        }
      } finally {
        setUploading(false);
      }
    },
    // [moduleId, mode, file, hyrdationState]
    [moduleId]
  );

  let serialNum = null;
  if (badgesLoaded && programLoaded && (!updating || moduleLoaded)) {
    //
    serialNum = updating ? module_.serial_num : program.modules.length + 1;
  } else {
    //
    return <ExpandedSpinner />;
  }

  return (
    <section className='mt-8'>
      <BackArrowButton />

      <header className='mb-4 flex items-start gap-x-4'>
        <div className='rounded-lg border bg-green-600/20 px-3 py-2'>
          <p className='text-sm text-black/50'>Program</p>
          <p className='mr-4 text-lg font-bold'>
            {programLoaded && program.name}
          </p>
        </div>
        <div className='rounded-lg border bg-indigo-600/20 px-3 py-2'>
          <p className='text-sm text-black/50'>Module Number</p>
          <p className='mr-4 text-lg font-bold'>{serialNum}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex flex-col items-start'>
          <label className='mb-3 pl-1 text-lg font-semibold'>
            Module Completion Badge
          </label>
          <div className='floating-select'>
            <select {...register("completion_badge")}>
              {badges.map((badge: any) => (
                <option key={badge.id} value={badge.id}>
                  {badge.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* <ImageDropBlock
          label='Assign Character To Defeat'
          rootProps={getRootProps()}
          inputProps={getInputProps()}
          isDragActive={isDragActive}
          preview={preview}
          helper={`*Recommended Aspect Ratio: 1:2, Recommended Size: 200x400px`}
        /> */}

        <label className='relative flex cursor-pointer select-none items-center'>
          <input
            type='checkbox'
            className='peer sr-only'
            defaultChecked={true}
            {...register("publish")}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          <span className='ml-3'>Publish</span>
        </label>

        <button disabled={uploading} type='submit' className='w-button mt-4'>
          {uploading ? <Ellipsis size={20} /> : updating ? "Save" : "Create"}
        </button>
      </form>
      {updating && <ModuleDayList module_={module_} />}
    </section>
  );
}
