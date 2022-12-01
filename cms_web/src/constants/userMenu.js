import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaClipboardList } from "react-icons/fa";

const userPrimaryMenu = [
  {
    name: "Home",
    link: "/user/home",
    icon: <AiFillHome color="white" />,
  },
  {
    name: "Manage Projects",
    link: "/user/projects",
    icon: <FaClipboardList color="white" />,
  },
  {
    name: "Meetings",
    link: "/user/meetings",
    icon: <FaClipboardList color="white" />,
  },
  {
    name: "Bugs",
    link: "/user/bugs",
    icon: <FaClipboardList color="white" />,
  },
];

export default userPrimaryMenu;
