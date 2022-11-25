import { Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AgGrid } from "..";
import { USERS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import Button from "../Button";
import CustomSpinner from "../CustomSpinner";
import Layout from "../Layout";
import UserForm from "./UserForm";

const ViewUsers = () => {
  const toast = useCustomToastr();
  const [usersData, setUsersData] = React.useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { users = [], ...initialQuery } = usersData;
  const [usersQuery, setUsersQuery] = React.useState({
    page: Number(searchParams.get("page")) || initialQuery.page,
    size: Number(searchParams.get("size")) || initialQuery.size,
  });
  const [loading, setLoading] = React.useState(false);
  const { isOpen: isCreateUserOpen, onOpen: onCreateUserOpen, onClose: onCreateUserClose } = useDisclosure();

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
      header: "User Name",
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
    const { isOpen: isEditUserOpen, onOpen: onEditUserOpen, onClose: onEditUserClose } = useDisclosure();
    return (
      <Box>
        <Button size="xs" onClick={() => onEditUserOpen()}>
          Edit User
        </Button>
        <Modal isOpen={isEditUserOpen} onClose={onEditUserClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <UserForm {...props} onClose={onEditUserClose} pageRefresher={fetchUsers} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };

  const rowData = React.useMemo(() => {
    let usersClone = users && users.slice();
    return usersClone.map((store, i) => ({
      ...store,
      sno: (initialQuery.page - 1) * initialQuery.size + i + 1,
      name: store.name || "-",
    }));
  }, [users]);

  const fetchUsers = (query = {}) => {
    setLoading(true);
    api
      .get(USERS + "?" + new URLSearchParams(query))
      .then((response) => {
        setUsersData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  const handlePaginationChange = ({ page = usersQuery.page, size = usersQuery.size }) => {
    if (page !== usersQuery.page) setUsersQuery({ ...usersQuery, page });
    if (size !== usersQuery.size) setUsersQuery({ ...usersQuery, page: 1, size: size });
    return;
  };

  React.useEffect(() => {
    const { page = 1, size = 50 } = usersQuery;
    setSearchParams({ page, size });
    fetchUsers({ page, size });
  }, [usersQuery]);

  return (
    <Layout>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Box>
          <Button onClick={() => onCreateUserOpen()}>Create User</Button>
          <Modal isOpen={isCreateUserOpen} onClose={onCreateUserClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <UserForm onClose={onCreateUserClose} pageRefresher={fetchUsers} />
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

export default ViewUsers;
