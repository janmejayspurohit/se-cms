import React from "react";

// CSS Imports
import "./App.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "react-datepicker/dist/react-datepicker.css";
import customTheme from "./styles/theme";

//Other Imports
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { Login, ResetCredentials } from "./components/pages/auth";
import { Lost } from "./components/pages";
import { ResponseInterceptor } from "./utils/ResponseInterceptor";

// HOCs
import WithUser from "./hocs/WithUser";
import WithAdmin from "./hocs/WithAdmin";

// Pages
import { UserHome } from "./components/pages/user";
import { AdminHome } from "./components/pages/admin";
import { Profile, ProfileEdit } from "./components/common";
import { ViewTechs } from "./components/common/techs";
import { ViewUsers } from "./components/common/users";
import { ViewProjects } from "./components/common/projects";
import { ViewCustomers } from "./components/common/customers";
import { ViewMeetings } from "./components/common/meetings";
import { ViewBugs } from "./components/common/bugs";
import Upload from "./components/common/uploads/Upload";

const App = () => {
  return (
    <ChakraProvider resetCSS theme={customTheme}>
      <ResponseInterceptor />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="reset-credentials" element={<ResetCredentials />} />
        <Route path="user" element={<WithUser />}>
          <Route path="home" element={<UserHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          <Route path="projects" element={<ViewProjects />} />
          <Route path="meetings" element={<ViewMeetings />} />
          <Route path="bugs" element={<ViewBugs />} />
        </Route>
        <Route path="admin" element={<WithAdmin />}>
          <Route path="home" element={<AdminHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          <Route path="techs" element={<ViewTechs />} />
          <Route path="users" element={<ViewUsers />} />
          <Route path="customers" element={<ViewCustomers />} />
          <Route path="projects" element={<ViewProjects />} />
          <Route path="meetings" element={<ViewMeetings />} />
          <Route path="bugs" element={<ViewBugs />} />
          <Route path="upload" element={<Upload />} />
        </Route>
        <Route path="*" element={<Lost />} />
      </Routes>
    </ChakraProvider>
  );
};

export default App;
