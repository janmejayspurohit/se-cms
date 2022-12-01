import React from "react";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaClipboardList } from "react-icons/fa";

const adminPrimaryMenu = [
  {
    name: "Home",
    link: "/admin/home",
    icon: <AiFillHome color="white" />,
  },
  {
    name: "My Profile",
    link: "/admin/profile",
    icon: <CgProfile color="white" />,
  },
  {
    name: "Tech",
    link: "/admin/techs",
    icon: <FaClipboardList color="white" />,
  },
  {
    name: "Users",
    link: "/admin/users",
    icon: <FaClipboardList color="white" />,
  },
  {
    name: "Customers",
    link: "/admin/customers",
    icon: <FaClipboardList color="white" />,
  },
  {
    name: "Projects",
    link: "/admin/projects",
    icon: <FaClipboardList color="white" />,
  },
  {
    name: "Meetings",
    link: "/admin/meetings",
    icon: <FaClipboardList color="white" />,
  },
  {
    name: "Bugs",
    link: "/admin/bugs",
    icon: <FaClipboardList color="white" />,
  },
];

export default adminPrimaryMenu;
