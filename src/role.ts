// WARNING: Make sure the values match with the ones in server
export enum Role {
  SuperAdmin = "super_admin",
  ProgramAdmin = "program_admin",
  Student = "student",
  Teacher = "teacher",
  Researcher = "researcher",
  Coach = "coach"
}

// @ts-ignore
window.Role = Role;

export function iterRoles(exclude: Role[] = []) {
  let list = [
    { role: Role.SuperAdmin, name: roleToString(Role.SuperAdmin) },
    { role: Role.ProgramAdmin, name: roleToString(Role.ProgramAdmin) },
    { role: Role.Student, name: roleToString(Role.Student) },
    { role: Role.Teacher, name: roleToString(Role.Teacher) },
    { role: Role.Researcher, name: roleToString(Role.Researcher) },
    { role: Role.Coach, name: roleToString(Role.Coach) }
  ];

  return list.filter(x => !exclude.includes(x.role));
}

export function roleToString(role: Role): string {
  switch (role) {
    case Role.SuperAdmin:
      return "Super Admin";
    case Role.ProgramAdmin:
      return "Program Admin";
    case Role.Student:
      return "Student";
    case Role.Teacher:
      return "Facilitator";
    case Role.Researcher:
      return "Researcher";
    case Role.Coach:
      return "Coach";
  }

  return "unknown";
}
