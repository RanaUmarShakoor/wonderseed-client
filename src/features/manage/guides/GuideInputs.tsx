import { useQueryClient } from "@tanstack/react-query";
import { apiConn, useGetGuides } from "apiconn";
import { ImageDropBlock } from "components/ImageDropBlock";
import { ExpandedSpinner } from "components/Spinner";
import { useEffect, useState } from "react";
import { Ellipsis } from "react-css-spinners";
import { useDropzone } from "react-dropzone";
import { FileResourceHandle, uploadFile, useMediaUpload } from "utils";

export function GuideInputs({ panel }: { panel: string }) {
  const queryClient = useQueryClient();
  const [platform, setPlatform] = useState("");
  const [training, setTraining] = useState("");

  const [uploading, setUploading] = useState(false);

  const { data: guides, isLoading } = useGetGuides({
    keepPreviousData: true,
    initialData: []
  });

  useEffect(() => {
    if (isLoading) return;

    let current = guides.find((g: any) => g.panel === panel);

    setPlatform(current?.platform ?? "");
    setTraining(current?.training ?? "");
    reset();
    if (current?.media)
      //
      hydrateWith(current?.media);
  }, [guides, panel, isLoading]);

  /* =============== Video =============== */

  const { file, preview, onDrop, hydrateWith, hyrdationState, mode, reset } =
    useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4"]
    }
  });

  /* =============== Saving =============== */

  const handleSave = async () => {
    setUploading(true);
    try {
      let handle: FileResourceHandle | null = null;
      if (mode === "local") {
        if (file !== null) handle = await uploadFile(file, "guides-media");
      } else {
        handle = hyrdationState!;
      }

      let resp = await apiConn.post("/guides/upsert", {
        panel,
        platform,
        training,
        media_type: handle === null ? "empty" : "video",
        media: handle?.id ?? null
      });
      console.log(resp.data);
      queryClient.invalidateQueries({ queryKey: ["guides"] });
      alert("Updated");

      if (handle !== null && mode === "local")
        //
        hydrateWith(handle);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <ExpandedSpinner />;

  let trainingLabel =
    panel === "teacher" ? "Train the Trainer" : "Platform Demo";

  return (
    <>
      <h5 className='mb-4 text-2xl font-bold'>Guides</h5>
      <section className='mb-4 space-y-4'>
        <div className='flex flex-col gap-y-2'>
          <label>How To Use Platform</label>
          <textarea
            placeholder=' '
            className='h-56 rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2'
            value={platform}
            onChange={event => setPlatform(event.currentTarget.value)}
          ></textarea>
        </div>
        <div className='flex flex-col gap-y-2'>
          <label>{trainingLabel}</label>
          <textarea
            placeholder=' '
            className='h-56 rounded-sm border-2 border-[#C9DAD7] bg-transparent p-2'
            value={training}
            onChange={event => setTraining(event.currentTarget.value)}
          ></textarea>
        </div>
        <ImageDropBlock
          label={"Upload Video for " + trainingLabel}
          rootProps={getRootProps()}
          inputProps={getInputProps()}
          isDragActive={isDragActive}
          preview={preview}
          mediaType='video'
          allowDelete
          onDelete={reset}
          // allowVideoPlay
        />
        <button disabled={uploading} onClick={handleSave} className='w-button'>
          {uploading ? <Ellipsis size={20} /> : "Save"}
        </button>
      </section>
    </>
  );
}
