export type ChatHandle = { cohort: any; user: any };

export function fullname(user: any) {
  return user.first_name + " " + user.last_name;
}
