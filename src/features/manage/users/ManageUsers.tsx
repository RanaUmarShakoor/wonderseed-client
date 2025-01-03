import { Route, Routes } from "react-router-dom";
import { UserIndexView } from "./UserIndexView";
import { UserListView } from "./UserListView";

export default function ManageUsers() {
  return (
    <Routes>
      <Route path='/' Component={UserListView} />
      <Route path='/new' Component={UserIndexView} />
      <Route path='/edit/:userId' Component={UserIndexView} />
    </Routes>
  );
}
