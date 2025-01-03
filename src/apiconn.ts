import axios from "axios";
import { appStoreInstance } from "./stores/main";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const apiConn = axios.create({
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  baseURL: apiUrl,

  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0"
  },

  // `responseType` indicates the type of data that the server will respond with
  responseType: "json",

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 0,

  maxContentLength: 5000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 0 // default
});

// Add the authorization header to every request.
apiConn.interceptors.request.use(
  function (config) {
    let { isAuthenticated, accessToken } = appStoreInstance.getState().auth;

    if (isAuthenticated && accessToken)
      config.headers["X-ACCESS-TOKEN"] = accessToken;

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

(<any>window).apiConn = apiConn;

let uploadsUrlEndpoint = "";
export function setUploadUrl(url: string) {
  uploadsUrlEndpoint = url;
}

export function resolveUploadUrl(path: string) {
  if (path === undefined || path === null) {
    console.log("ERROR: ::resolveUploadUrl(): null path received");
    return "";
  }

  // Remove trailing slashes
  path = path.replace(/^\/+/g, "");
  // return `${apiUrl}/uploads/${path}`;
  return `${uploadsUrlEndpoint}/${path}`;
}
(<any>window).resolveUploadUrl = resolveUploadUrl;

export function callApiGet(endpoint: string) {
  return async () => {
    let resp = await apiConn.get(endpoint);
    return resp.data.content;
  };
}

// @ts-ignore
window.callApiGet = callApiGet;

export const useGetUsers = (opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["users"],
    queryFn: callApiGet("/users"),
    ...opts
  });

export const useGetUser = (id: any, opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["user", id],
    queryFn: callApiGet(`/user/${id}`),
    ...opts
  });

export const useGetPrograms = (opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["programs"],
    queryFn: callApiGet("/programs"),
    ...opts
  });

export const useGetProgram = (
  id: any,
  opts: UseQueryOptions & { includeDays?: boolean } = {}
) => {
  let queryKey = ["program", id, !!opts.includeDays] as const;
  return useQuery<any, any, any>({
    queryKey,
    queryFn: callApiGet(
      `/program/${id}` + (opts.includeDays ? "?includeDays=1" : "")
    ),
    ...opts
  });
};

export const useGetModule = (
  id: any,
  opts: UseQueryOptions & { includeParentProgram?: boolean } = {}
) =>
  useQuery<any, any, any>({
    queryKey: ["module", id, !!opts.includeParentProgram],
    queryFn: callApiGet(
      `/module/${id}` +
        (opts.includeParentProgram ? "?includeParentProgram=1" : "")
    ),
    ...opts
  });

export const useGetDay = (id: any, opts: UseQueryOptions) =>
  useQuery<any, any, any>({
    queryKey: ["day", id],
    queryFn: callApiGet(`/day/${id}`),
    ...opts
  });

export const useGetBadges = (opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["badges"],
    queryFn: callApiGet("/badges"),
    ...opts
  });

export const useGetBadge = (id: any, opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["badge", id],
    queryFn: callApiGet(`/badge/${id}`),
    ...opts
  });

/*
export const useGetCohorts = (
  opts: UseQueryOptions & {
    programId?: string;
  } = {}
) =>
  useQuery<any, any, any>({
    queryKey: ["cohorts", opts.programId],
    queryFn: callApiGet(
      "/cohorts" + (opts.programId ? `?programId=${opts.programId}` : "")
    ),
    ...opts
  });
*/

export const useGetCohort = (id: any, opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["cohort", id],
    queryFn: callApiGet(`/cohort/${id}`),
    ...opts
  });

export const useGetTeacherCohorts = (tid: any, opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["teacher-cohorts", tid],
    queryFn: callApiGet(`/teacher-cohorts/${tid}`),
    ...opts
  });

export const useGetStudentCohorts = (sid: any, opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["student-cohorts", sid],
    queryFn: callApiGet(`/student-cohorts/${sid}`),
    ...opts
  });

export const useGetFaqs = (opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["faqs"],
    queryFn: callApiGet("/faqs"),
    ...opts
  });

export const useGetGuides = (opts: UseQueryOptions = {}) =>
  useQuery<any, any, any>({
    queryKey: ["guides"],
    queryFn: callApiGet("/guides"),
    ...opts
  });
