import { BackArrowButton } from "components/BackArrowButton";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useForm, type SubmitHandler } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { apiConn, useGetProgram, useGetUsers } from "apiconn";
import { useQueryClient } from "@tanstack/react-query";
import { ExpandedSpinner } from "components/Spinner";
import { Role } from "role";
import { FileResourceHandle, uploadFile, useMediaUpload } from "utils";
import { useDropzone } from "react-dropzone";
import { ImageDropBlock } from "components/ImageDropBlock";
import { Ellipsis } from "react-css-spinners";

export function ProgramFormView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm();
  const [uploading, setUploading] = useState(false);

  const programId = useParams().programId;
  let updating = programId !== undefined;

  let {
    data: users,
    isSuccess: usersLoaded,
    isLoading: usersLoading
  } = useGetUsers({
    initialData: [],
    keepPreviousData: true
  });

  if (usersLoaded)
    users = users.filter((u: any) => u.role === Role.ProgramAdmin);

  let {
    data: program,
    isSuccess,
    isLoading
  } = useGetProgram(programId, {
    keepPreviousData: true,
    enabled: updating && usersLoaded
  });

  useEffect(() => {
    if (!updating)
      //
      return;

    if (program == undefined || !isSuccess) return;

    let server_admin_id = program.admin_id;
    setValue("name", program.name);
    setValue("welcome_msg", program.welcome_msg);
    setValue("preassessment", program.preassessment);
    setValue("program_type", program.program_type ?? "student");
    if (program.image) hydrateWith(program.image);
  }, [program, isSuccess]);

  /* =============== Character Image =============== */

  const { file, preview, onDrop, hydrateWith, hyrdationState, mode } =
    useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"]
    }
  });

  const onSubmit: SubmitHandler<any> = useCallback(
    async data => {
      setUploading(true);
      try {
        let handle: FileResourceHandle;
        if (mode === "local") {
          if (file === null) return alert("Image missing");

          handle = await uploadFile(file, "program-image");
        } else {
          handle = hyrdationState!;
        }

        let { name, welcome_msg, preassessment, program_type } = data;
        name = name.trim();
        welcome_msg = welcome_msg.trim();

        if (!name.length)
          //
          return alert("Please enter a name");

        if (!welcome_msg.length)
          //
          return alert("Please enter a Welcome message");

        let server_data = {
          name,
          preassessment,
          welcome_msg,
          image: handle.id,
          program_type
        };

        let url = updating
          ? `/programs/update/${programId}`
          : "/programs/create";
        let resp = await apiConn.post(url, server_data);

        if (resp.data.status === "success") {
          if (updating) {
            queryClient.invalidateQueries({ queryKey: ["programs"] });
            queryClient.invalidateQueries({ queryKey: ["program", programId] });
          }
          navigate(-1);
        } else {
          alert("An error occured");
          console.log(resp.data);
        }
      } finally {
        setUploading(false);
      }
    },
    [programId, mode, file, hyrdationState]
  );

  if ((updating && isLoading) || usersLoading)
    //
    return <ExpandedSpinner />;

  return (
    <section className='mt-8'>
      <BackArrowButton />

      <h4 className='mb-8 text-3xl font-bold'>
        {updating ? "Edit Program" : "Create New Program"}
      </h4>

      <form onSubmit={handleSubmit(onSubmit)} className='max-w-lg space-y-4'>
        {/*  */}
        <div className='floating-input'>
          <input required {...register("name")} placeholder=' ' size={1} />
          <label>Program Name</label>
        </div>
        {/*  */}
        <div className='flex flex-col gap-y-2'>
          <label>Welcome Message</label>
          <textarea
            required
            {...register("welcome_msg")}
            placeholder=' '
            className='rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2'
          ></textarea>
        </div>
        {/*  */}

        <div className='mt-8 flex flex-col items-start'>
          <label className='mb-3 pl-1 text-lg font-semibold'>
            Program Type
          </label>
          <div className='floating-select'>
            <select
              disabled={updating}
              {...register("program_type")}
            >
              <option value='student'>Students Program</option>
              <option value='coach'>Coaches Program</option>
            </select>
          </div>
        </div>

        <label className='relative mt-4 flex cursor-pointer select-none items-center'>
          <input
            {...register("preassessment")}
            type='checkbox'
            className='peer sr-only'
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
          <span className='ml-3'>Pre Assessment</span>
        </label>

        <ImageDropBlock
          label='Program Image'
          rootProps={getRootProps()}
          inputProps={getInputProps()}
          isDragActive={isDragActive}
          preview={preview}
          helper={`*Recommended Aspect Ratio: 1:1, Recommended Size: 400x400px`}
        />

        <button disabled={uploading} type='submit' className='w-button'>
          {uploading ? <Ellipsis size={20} /> : "Save"}
        </button>
      </form>
    </section>
  );
}
