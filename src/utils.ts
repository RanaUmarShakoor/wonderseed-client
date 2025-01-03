import { UseQueryOptions } from "@tanstack/react-query";
import { apiConn, resolveUploadUrl, useGetCohort } from "apiconn";
import {
  Dispatch,
  useEffect,
  EffectCallback,
  DependencyList,
  useCallback,
  useState,
  useMemo
} from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "role";
import { useAppStoreKey } from "stores/main";

export function redirectTo(location: string) {
  return () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate(location);
    }, []);
    return null;
  };
}

export type VoidCallback = () => void;
export type ParamVoidCallback<T> = (value: T) => void;

export function eventsett<T>(setter: Dispatch<T>, value: T) {
  return () => setter(value);
}

export class CounterID {
  private current: number = 0;
  constructor(start?: number) {
    this.current = start || 0;
  }

  generate(): number {
    return this.current++;
  }
}

export function useAutoFillEffect(
  enabled: boolean,
  func: EffectCallback,
  deps?: DependencyList
) {
  useEffect(() => {
    if (!enabled)
      //
      return;

    return func();
  }, [enabled, ...(deps || [])]);
}

export function useReactiveGetter<T>(obj: T) {
  return useCallback(() => obj, [obj]);
}

export function toNumOrNull(
  val: string | undefined | null | number
): number | null {
  if (val == undefined) return null;

  if (typeof val === "number") return val;

  val = val.trim();
  let asnum = +val;
  return val === "" ? null : (asnum as any) == val ? asnum : null;
}

export type FileResourceHandle = {
  id: any;
  filePath: string;
};

export function useMediaUpload(afterDrop?: VoidCallback) {
  const [mode, setMode] = useState<"local" | "server">("local");
  const [hyrdationState, setHyrdationState] = useState<
    FileResourceHandle | undefined
  >(undefined);

  let [file, setFile] = useState<File | null>(null);
  const localPreview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  const onDrop = useCallback((uploaded: File[]) => {
    uploaded.length != 0 && setFile(uploaded[0]);
    setMode("local");
    afterDrop?.();
  }, []);

  const reset = useCallback(() => {
    setMode("local");
    setFile(null);
  }, []);

  const hydrateWith = (data: FileResourceHandle) => {
    setMode("server");
    setHyrdationState(data);
  };

  const preview =
    mode === "local"
      ? localPreview
      : resolveUploadUrl(hyrdationState!.filePath);

  return {
    file,
    setFile,
    localPreview,
    preview,
    onDrop,
    hyrdationState,
    hydrateWith,
    mode,
    setMode,
    reset
  };
}

export async function uploadFile(file: File, reason: string) {
  const formData = new FormData();
  formData.set("source", file);

  let res = await apiConn.post(`/upload/${reason}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  let content: FileResourceHandle = res.data.content;
  return content;
}

// Converts mongodb id to app id
export function toAppId(id: string) {
  id = id.toUpperCase();
  let timestamp = id.substring(0, 8);
  // let counter = id.substring(18);

  return "W" + timestamp;
}

export function filterPanel(panel: string, role: string) {
  if (panel === "teacher" && role === Role.Teacher) return true;
  if (panel === "student" && role === Role.Student) return true;
  if (panel === "coach" && role === Role.Coach) return true;

  return false;
}

export function useCurrentUser() {
  const { user: currentUser } = useAppStoreKey("auth");
  const isSuperAdmin = currentUser?.role === Role.SuperAdmin;
  const isResearcher = currentUser?.role === Role.Researcher;
  const isCoach = currentUser?.role === Role.Coach;

  return {
    currentUser,
    isSuperAdmin,
    isResearcher,
    isCoach
  };
}

export function useStudentCohort(opts: UseQueryOptions = {}) {
  const auth = useAppStoreKey("auth");
  return useGetCohort(auth.cohortId, opts);
}

export function useStudentEnrollment(opts: UseQueryOptions = {}) {
  const auth = useAppStoreKey("auth");
  const { data: cohort, ...other } = useGetCohort(auth.cohortId, opts);

  let enrollment = cohort?.students.find(
    (st: any) => st.user.id === auth.user?.id
  );

  return { cohort, data: enrollment, ...other };
}

export function calcProgress(program: any, student: any) {
  let { current_module } = student;

  let modules = program?.modules || [];
  let totalModules = modules.length;

  let modSerial: string;
  if (current_module >= totalModules) modSerial = "-Program Completed-";
  else modSerial = modules[current_module].serial_num;

  let progress: number;
  if (totalModules === 0) progress = 1;
  else {
    progress = Math.min(current_module, totalModules) / totalModules;
  }

  return {
    modSerial,
    progress
  };
}

export function studentLearningTime(student: any) {
  let learningSecs = 0;

  let { completions } = student;

  for (let i = 0; i < completions?.length ?? 0; ++i)
    learningSecs += completions[i].time_spent_secs;

  if (learningSecs === 0) return "0h";

  let learningTime = `${Math.max(1, Math.floor(learningSecs / 3600))}h`;

  return learningTime;
}

export function resolveUserPfp(user: any) {
  return user.pfp ? resolveUploadUrl(user.pfp.filePath) : "/default-pfp.png";
}
