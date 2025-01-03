import { motion, AnimatePresence } from "framer-motion";
import { useSideView } from "components/SideView/SideView";
import { Link } from "react-router-dom";
import * as anims from "anims";

export function SidebarLogoutButton() {
  const { collapsed } = useSideView();

  return (
    <Link to='/logout'>
      <AnimatePresence>
        {!collapsed.value && (
          <motion.button
            {...anims.fadeInOut}
            id='sidebar-logout-btn'
            className='my-5 shrink-0 self-start'
          >
            Logout
          </motion.button>
        )}
      </AnimatePresence>
    </Link>
  );
}
