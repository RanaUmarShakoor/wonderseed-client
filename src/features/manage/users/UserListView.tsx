import { useQueryClient } from "@tanstack/react-query";
import { apiConn, useGetPrograms, useGetUsers } from "apiconn";
import { useCallback, useState } from "react";
import { Ellipsis } from "react-css-spinners";
import { Link } from "react-router-dom";
import { Role, iterRoles, roleToString } from "role";
import { useAppStoreKey } from "stores/main";
import { useCurrentUser } from "utils";

type TableFilter<T> = T | false;

function UserTableRow({ user }: { user: any }) {
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    let userId = user.id;
    try {
      let resp = await apiConn.post("/users/delete", {
        user_id: userId
      });

      let { message, status } = resp.data;
      if (status === 'failure') {
        alert(message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    } catch (e) {
      alert("An error occured");
    } finally {
      setDeleting(false);
    }
  }, [user]);

  return (
    <tr
      key={user.id}
      className='border-b bg-white hover:bg-gray-50 [&>td]:px-6 [&>td]:py-3'
    >
      <td className='whitespace-nowrap font-medium text-gray-900'>
        {user.first_name} {user.last_name}
      </td>
      <td>{user.email}</td>
      <td>{roleToString(user.role as Role)}</td>
      <td>{user.program?.name ?? "N/A"}</td>
      <td>{user.app_id}</td>
      <td className='whitespace-nowrap'>
        <div className='flex items-center justify-end gap-x-3'>
          {deleting ? (
            <Ellipsis color='#dc2626' size={20} />
          ) : (
            <a
              href='#'
              onClick={handleDelete}
              className='font-medium text-red-600 hover:underline'
            >
              Delete
            </a>
          )}
          <Link
            to={`edit/${user.id}`}
            className='font-medium text-blue-600 hover:underline'
          >
            Edit
          </Link>
          {/*
          <a
            href='#'
            className='font-medium text-teal-600 hover:underline'
          >
            Send Passlink
          </a>
            */}
        </div>
      </td>
    </tr>
  );
}

function UserTable({
  users,
  filterRole,
  filterPID
}: {
  users: any[];
  programs: any[];
  filterRole: TableFilter<Role>;
  filterPID: TableFilter<string>;
}) {
  const { isSuperAdmin, currentUser } = useCurrentUser();

  let userlist = users;

  if (filterRole !== false)
    userlist = userlist.filter(user => user.role === filterRole);

  if (filterPID !== false)
    userlist = userlist.filter(user => user.program?.id === filterPID);

  if (!isSuperAdmin) {
    userlist = userlist.filter(user => {
      if (user.id == currentUser.id) return true;

      let notAllowed = [
        Role.ProgramAdmin,
        Role.SuperAdmin /* TODO: Reseacher role */
      ];
      return !notAllowed.includes(user.role);
    });
  }

  return (
    <div className='relative mt-10 overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-left text-sm text-gray-500'>
        <thead className='bg-green-1 text-xs uppercase text-white'>
          <tr className='whitespace-nowrap [&>th]:px-6 [&>th]:py-3'>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Program Name</th>
            <th>ID</th>
            <th>
              <span className='sr-only'></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {userlist.map(user => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UserListView() {
  const { currentUser, isSuperAdmin, isResearcher } = useCurrentUser();

  let { data: programs, isSuccess: programsLoaded } = useGetPrograms();

  let { data: users } = useGetUsers({
    keepPreviousData: true,
    initialData: [],
    // Fetch users only after program list has been fetched
    enabled: programsLoaded
  });

  let [filterRole, setFilterRole] = useState<TableFilter<Role>>(false);
  let [filterPID, setFilterPID] = useState<TableFilter<string>>(false);

  programs = programs || [];

  return (
    <section className='mt-8'>
      <h4 className='mb-6 text-4xl font-bold'>Users</h4>
      <div className='flex gap-x-6'>
        {isSuperAdmin && (
          <div className='flex flex-col items-start'>
            <div className='floating-select'>
              <select
                onChange={e => {
                  let value = e.target.value || "all";
                  setFilterPID(value === "all" ? false : value);
                }}
              >
                <option value='all'>All Programs</option>
                {programs.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className='flex flex-col items-start'>
          <div className='floating-select'>
            <select
              onChange={e => {
                let value = e.target.value || "all";
                setFilterRole(value === "all" ? false : (value as Role));
              }}
            >
              <option value='all'>All Roles</option>
              {iterRoles().map(({ role, name }) => (
                <option key={role} value={role}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!isResearcher && (
          <Link to='new' className='w-button ml-auto self-center'>
            Add New User
          </Link>
        )}
      </div>

      <UserTable
        users={users}
        programs={programs}
        filterPID={isSuperAdmin ? filterPID : currentUser.program.id}
        filterRole={filterRole}
      />
    </section>
  );
}
