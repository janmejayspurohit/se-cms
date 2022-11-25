import { Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AgGrid } from "..";
import { PROJECTS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import Button from "../Button";
import CustomSpinner from "../CustomSpinner";
import Layout from "../Layout";
import ProjectForm from "./ProjectForm";

const ViewProjects = () => {
  const toast = useCustomToastr();
  const [projectsData, setProjectsData] = React.useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects = [], ...initialQuery } = projectsData;
  const [projectsQuery, setProjectsQuery] = React.useState({
    page: Number(searchParams.get("page")) || initialQuery.page,
    size: Number(searchParams.get("size")) || initialQuery.size,
  });
  const [loading, setLoading] = React.useState(false);
  const { isOpen: isCreateProjectOpen, onOpen: onCreateProjectOpen, onClose: onCreateProjectClose } = useDisclosure();

  // GRID STATES
  const [, setGridApi] = useState(null);
  const [, setGridColumnApi] = React.useState();

  const columns = [
    {
      header: "S. No",
      accessor: "sno",
      width: 70,
    },
    {
      header: "Project Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: "role",
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Actions",
      accessor: "actions",
      cellRenderer: (params) => <GetEditForm {...params.data} />,
    },
  ];

  const GetEditForm = (props) => {
    const { isOpen: isEditProjectOpen, onOpen: onEditProjectOpen, onClose: onEditProjectClose } = useDisclosure();
    return (
      <Box>
        <Button size="xs" onClick={() => onEditProjectOpen()}>
          Edit Project
        </Button>
        <Modal isOpen={isEditProjectOpen} onClose={onEditProjectClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Project</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ProjectForm {...props} onClose={onEditProjectClose} pageRefresher={fetchProjects} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };

  const rowData = React.useMemo(() => {
    let projectsClone = projects && projects.slice();
    return projectsClone.map((p, i) => ({
      ...p,
      sno: (initialQuery.page - 1) * initialQuery.size + i + 1,
      name: p.name || "-",
    }));
  }, [projects]);

  const fetchProjects = (query = {}) => {
    setLoading(true);
    api
      .get(PROJECTS + "?" + new URLSearchParams(query))
      .then((response) => {
        setProjectsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  const handlePaginationChange = ({ page = projectsQuery.page, size = projectsQuery.size }) => {
    if (page !== projectsQuery.page) setProjectsQuery({ ...projectsQuery, page });
    if (size !== projectsQuery.size) setProjectsQuery({ ...projectsQuery, page: 1, size: size });
    return;
  };

  React.useEffect(() => {
    const { page = 1, size = 50 } = projectsQuery;
    setSearchParams({ page, size });
    fetchProjects({ page, size });
  }, [projectsQuery]);

  return (
    <Layout>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Box>
          <Button onClick={() => onCreateProjectOpen()}>Create Project</Button>
          <Modal isOpen={isCreateProjectOpen} onClose={onCreateProjectClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Project</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <ProjectForm onClose={onCreateProjectClose} pageRefresher={fetchProjects} />
              </ModalBody>
            </ModalContent>
          </Modal>
          <Flex height="75vh" borderRadius="1em">
            <AgGrid
              columns={columns}
              data={rowData}
              setGridApi={setGridApi}
              setGridColumnApi={setGridColumnApi}
              // Pagination
              manualPagination={initialQuery?.pageCount > 1 ? true : false}
              handlePaginationChange={handlePaginationChange}
              pageIndex={initialQuery?.page}
              pageSize={initialQuery?.size}
              pageCount={initialQuery?.pageCount}
              sizeOptions={[10, 50, 100, 200]}
            />
          </Flex>
        </Box>
      )}
    </Layout>
  );
};

export default ViewProjects;
