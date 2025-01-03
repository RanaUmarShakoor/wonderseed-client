import { useEffect, useCallback, useState, ReactNode } from "react";
import {
  useOnCollected,
  ElementInstance,
  useOnHydrated
} from "../DayDesignBase";

import { DropzoneOptions, useDropzone } from "react-dropzone";
import { VoidCallback, useMediaUpload, uploadFile } from "utils";
import { apiConn, resolveUploadUrl } from "apiconn";

export type FileUploadCollection = {
  file: File | null;
  mode: "local" | "server";
  hyrdationState?: {
    id: any;
    filePath: string;
  };
};

export async function fileUploadTransform(collected: FileUploadCollection) {
  const { hyrdationState, file, mode } = collected;

  if (mode == "server") return hyrdationState!;
  else return await uploadFile(file!, "design-fill");
}

export function fileUploadSkip(collected: FileUploadCollection) {
  return collected.mode === "local" && collected.file === null;
}

export function FileUploadElement({
  instance,
  title,
  subtitle,
  afterUpload = () => {},
  dropzoneOpts,
  generatePreview
}: {
  instance: ElementInstance<FileUploadCollection>;
  title: string;
  subtitle: string;
  afterUpload?: VoidCallback;
  dropzoneOpts: DropzoneOptions;
  generatePreview: (source: string) => ReactNode;
}) {
  /*
  const [mode, setMode] = useState<"local" | "server">("local");
  const [hyrdationState, setHyrdationState] = useState<FileUploadCollection['hyrdationState'] | undefined>(undefined);
  */
  const { file, onDrop, preview, mode, hyrdationState, hydrateWith } =
    useMediaUpload();

  useOnHydrated(instance, data => {
    // setMode("server");
    // setHyrdationState(data);
    hydrateWith(data);
  });

  useOnCollected(
    instance,
    useCallback(
      () => ({
        mode,
        file,
        hyrdationState
      }),
      [file, mode]
    )
  );

  useEffect(afterUpload, [file]);

  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOpts,
    onDrop
  });

  return (
    <div>
      <div
        className='flex cursor-pointer flex-col items-center
                    justify-center rounded-xl border-2 border-dashed
                  border-[#b9bcc2] bg-[#F2F3F3] py-8'
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <h2 className='text-xl font-bold text-black'>{title}</h2>
        <p className='mt-4 uppercase text-[#A0A8B3]'>{subtitle}</p>
      </div>
      {preview && generatePreview(preview)}
    </div>
  );
}
