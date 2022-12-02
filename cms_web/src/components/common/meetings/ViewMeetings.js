import { Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AgGrid } from "..";
import { MEETINGS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import { formattedTimestamp } from "../../../utils/formattedTimestamp";
import useCustomToastr from "../../../utils/useCustomToastr";
import Button from "../Button";
import CustomSpinner from "../CustomSpinner";
import Layout from "../Layout";
import MeetingForm from "./MeetingForm";

const ViewMeetings = () => {
  const toast = useCustomToastr();
  const [meetingsData, setMeetingsData] = React.useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { meetings = [], ...initialQuery } = meetingsData;
  const [meetingsQuery, setMeetingsQuery] = React.useState({
    page: Number(searchParams.get("page")) || initialQuery.page,
    size: Number(searchParams.get("size")) || initialQuery.size,
  });
  const [loading, setLoading] = React.useState(false);
  const { isOpen: isCreateMeetingOpen, onOpen: onCreateMeetingOpen, onClose: onCreateMeetingClose } = useDisclosure();

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
      accessor: "project",
      cellRenderer: (params) => params.data.project.name,
    },
    {
      header: "Meeting ID",
      accessor: "meeting_id",
    },
    {
      header: "Meeting Link",
      accessor: "meeting_link",
    },
    {
      header: "Starts At",
      accessor: "starts_at",
      cellRenderer: (params) => formattedTimestamp({ timestamp: params.data.starts_at }),
    },
    {
      header: "Ends At",
      accessor: "ends_at",
      cellRenderer: (params) => formattedTimestamp({ timestamp: params.data.ends_at }),
    },
    {
      header: "Actions",
      accessor: "actions",
      cellRenderer: (params) => <GetEditForm {...params.data} />,
    },
  ];

  const GetEditForm = (props) => {
    const { isOpen: isEditMeetingOpen, onOpen: onEditMeetingOpen, onClose: onEditMeetingClose } = useDisclosure();
    return (
      <Box>
        <Button size="xs" onClick={() => onEditMeetingOpen()}>
          Edit
        </Button>
        <Modal isOpen={isEditMeetingOpen} onClose={onEditMeetingClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Meeting</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <MeetingForm {...props} onClose={onEditMeetingClose} pageRefresher={fetchMeetings} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Button
          size="xs"
          colorScheme="red"
          ml="2"
          onClick={() => {
            api
              .remove(`${MEETINGS}/${props.id}`)
              .then(() => {
                toast.showSuccess("Meeting deleted successfully!");
                fetchMeetings();
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
    let meetingsClone = meetings && meetings.slice();
    return meetingsClone.map((c, i) => ({
      ...c,
      sno: (initialQuery.page - 1) * initialQuery.size + i + 1,
      name: c.name || "-",
    }));
  }, [meetings]);

  const fetchMeetings = (query = {}) => {
    setLoading(true);
    api
      .get(MEETINGS + "?" + new URLSearchParams(query))
      .then((response) => {
        setMeetingsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  const handlePaginationChange = ({ page = meetingsQuery.page, size = meetingsQuery.size }) => {
    if (page !== meetingsQuery.page) setMeetingsQuery({ ...meetingsQuery, page });
    if (size !== meetingsQuery.size) setMeetingsQuery({ ...meetingsQuery, page: 1, size: size });
    return;
  };

  React.useEffect(() => {
    const { page = 1, size = 50 } = meetingsQuery;
    setSearchParams({ page, size });
    fetchMeetings({ page, size });
  }, [meetingsQuery]);

  return (
    <Layout>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Box>
          <Button onClick={() => onCreateMeetingOpen()}>Create Meeting</Button>
          <Modal isOpen={isCreateMeetingOpen} onClose={onCreateMeetingClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Meeting</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <MeetingForm onClose={onCreateMeetingClose} pageRefresher={fetchMeetings} />
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

export default ViewMeetings;
