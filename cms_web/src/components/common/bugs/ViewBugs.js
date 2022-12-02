import { Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AgGrid } from "..";
import { BUGS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { formattedTimestamp } from "../../../utils/formattedTimestamp";
import useCustomToastr from "../../../utils/useCustomToastr";
import Button from "../Button";
import CustomSpinner from "../CustomSpinner";
import Layout from "../Layout";
import BugForm from "./BugForm";

const ViewBugs = () => {
  const toast = useCustomToastr();
  const [bugsData, setBugsData] = React.useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { bugs = [], ...initialQuery } = bugsData;
  const [bugsQuery, setBugsQuery] = React.useState({
    page: Number(searchParams.get("page")) || initialQuery.page,
    size: Number(searchParams.get("size")) || initialQuery.size,
  });
  const [loading, setLoading] = React.useState(false);
  const { isOpen: isCreateBugOpen, onOpen: onCreateBugOpen, onClose: onCreateBugClose } = useDisclosure();

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
      header: "Project",
      accessor: "project",
      cellRenderer: (params) => params.data.project.name,
    },
    {
      header: "Description",
      accessor: "description",
      width: 370,
    },
    {
      header: "Deadline",
      accessor: "deadline",
      width: 270,
      cellRenderer: (params) => formattedTimestamp({ timestamp: params.data.ends_at }),
    },
    {
      header: "Actions",
      accessor: "actions",
      cellRenderer: (params) => <GetEditForm {...params.data} />,
    },
  ];

  const GetEditForm = (props) => {
    const { isOpen: isEditBugOpen, onOpen: onEditBugOpen, onClose: onEditBugClose } = useDisclosure();
    return (
      <Box>
        <Button size="xs" onClick={() => onEditBugOpen()}>
          Edit
        </Button>
        <Modal isOpen={isEditBugOpen} onClose={onEditBugClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Bug</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <BugForm {...props} onClose={onEditBugClose} pageRefresher={fetchBugs} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Button
          size="xs"
          colorScheme="red"
          ml="2"
          onClick={() => {
            api
              .remove(`${BUGS}/${props.id}`)
              .then(() => {
                toast.showSuccess("Bug deleted successfully!");
                fetchBugs();
              })
              .catch((error) => {
                const e = formattedErrorMessage(error);
                toast.showError(e);
              });
          }}
        >
          Delete
        </Button>
      </Box>
    );
  };

  const rowData = React.useMemo(() => {
    let bugsClone = bugs && bugs.slice();
    return bugsClone.map((c, i) => ({
      ...c,
      sno: (initialQuery.page - 1) * initialQuery.size + i + 1,
      name: c.name || "-",
    }));
  }, [bugs]);

  const fetchBugs = (query = {}) => {
    setLoading(true);
    api
      .get(BUGS + "?" + new URLSearchParams(query))
      .then((response) => {
        setBugsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  const handlePaginationChange = ({ page = bugsQuery.page, size = bugsQuery.size }) => {
    if (page !== bugsQuery.page) setBugsQuery({ ...bugsQuery, page });
    if (size !== bugsQuery.size) setBugsQuery({ ...bugsQuery, page: 1, size: size });
    return;
  };

  React.useEffect(() => {
    const { page = 1, size = 50 } = bugsQuery;
    setSearchParams({ page, size });
    fetchBugs({ page, size });
  }, [bugsQuery]);

  return (
    <Layout>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Box>
          <Button onClick={() => onCreateBugOpen()}>Create Bug</Button>
          <Modal isOpen={isCreateBugOpen} onClose={onCreateBugClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Bug</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <BugForm onClose={onCreateBugClose} pageRefresher={fetchBugs} />
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

export default ViewBugs;
