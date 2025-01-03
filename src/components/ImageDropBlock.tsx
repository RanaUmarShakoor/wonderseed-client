import cx from "classnames";
import { ReactNode } from "react";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";
import { VoidCallback } from "utils";

function OverlayActions({
  preview,
  isDragActive,
  allowDelete,
  onDelete,
  allowVideoPlay
}: {
  preview: string | null;
  isDragActive: boolean;
  allowDelete?: boolean;
  onDelete?: VoidCallback;
  allowVideoPlay?: boolean;
}) {
  return (
    <p
      className={cx(
        "flex flex-col items-center gap-y-2 text-xl font-bold",
        preview && !isDragActive
          ? "opacity-0 group-hover:opacity-100"
          : "opacity-100",
        preview && "text-white"
      )}
    >
      {isDragActive ? (
        "Drop"
      ) : (
        <>
          <span className={preview !== null ? "hover:text-cyan-500" : ""}>
            Upload
          </span>
          {preview !== null && allowVideoPlay && (
            <span
              className='hover:text-cyan-500'
              onClick={event => {
                event.stopPropagation();
              }}
            >
              Play
            </span>
          )}
          {preview !== null && allowDelete && (
            <span
              className='hover:text-cyan-500'
              onClick={event => {
                event.stopPropagation();
                onDelete?.();
              }}
            >
              Delete
            </span>
          )}
        </>
      )}
    </p>
  );
}

export function ImageDropBlock({
  isDragActive,
  preview,
  label,
  helper,
  className,
  mediaType = "image",
  allowDelete,
  onDelete,
  allowVideoPlay,
  ...p
}: {
  label?: string;
  helper?: ReactNode;
  rootProps: DropzoneRootProps;
  inputProps: DropzoneInputProps;
  isDragActive: boolean;
  preview: string | null;
  className?: string;
  mediaType?: "video" | "image";
  allowDelete?: boolean;
  onDelete?: VoidCallback;
  allowVideoPlay?: boolean;
}) {
  return (
    <section className={className}>
      {label && <p className='mb-2 text-lg font-semibold'>{label}</p>}

      <div
        {...p.rootProps}
        data-dragactive={isDragActive}
        className={cx(
          "group relative cursor-pointer rounded-lg border-2 border-dashed border-cyan-500 p-1",
          mediaType === "image" ? "max-w-[200px]" : "max-w-[500px]"
        )}
      >
        {preview ? (
          mediaType === "image" ? (
            <img
              src={preview}
              className='mx-auto mt-2 max-w-[50%]'
              alt='Img'
              onLoad={() => URL.revokeObjectURL(preview)}
            />
          ) : (
            <video
              // controls
              // ref={videoElemRef}
              crossOrigin=''
              autoPlay={false}
              playsInline
              onLoad={() => URL.revokeObjectURL(preview)}
              className='mx-auto max-w-full'
            >
              <source src={preview} type='video/mp4' />
            </video>
          )
        ) : (
          <img
            src={
              mediaType === "image" ? "/place-image.png" : "/place-video.png"
            }
            className='rounded-lg'
          />
        )}
        <div
          className={cx(
            "pin-center absolute inset-0 transition-colors",
            "group-hover:backdrop-blur-sm",
            "group-hover:bg-black/[0.25]",
            "group-[[data-dragactive=true]]:backdrop-blur-sm",
            "group-[[data-dragactive=true]]:bg-black/[0.25]",
            !preview && "bg-black/[0.05]"
          )}
        >
          <input {...p.inputProps} />
          <OverlayActions
            preview={preview}
            isDragActive={isDragActive}
            allowDelete={allowDelete}
            allowVideoPlay={allowVideoPlay}
            onDelete={onDelete}
          />
        </div>
      </div>
      {helper && (
        <div className='mt-2 text-base font-semibold text-red-600'>
          {helper}
        </div>
      )}
    </section>
  );
}
