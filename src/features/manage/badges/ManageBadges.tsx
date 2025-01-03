import { Route, Routes } from "react-router-dom";
import { BadgeListView } from "./BadgeListView";
import { BadgeIndexView } from "./BadgeIndexView";

export default function ManageBadges() {
  return (
    <Routes>
      <Route path='/' Component={BadgeListView} />
      <Route path='/new' Component={BadgeIndexView} />
      <Route path='/edit/:badgeId' Component={BadgeIndexView} />
    </Routes>
  );
}
