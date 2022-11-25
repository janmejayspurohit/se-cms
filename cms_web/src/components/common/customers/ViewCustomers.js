import { Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AgGrid } from "..";
import { CUSTOMERS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import Button from "../Button";
import CustomSpinner from "../CustomSpinner";
import Layout from "../Layout";
import CustomerForm from "./CustomerForm";

const ViewCustomers = () => {
  const toast = useCustomToastr();
  const [customersData, setCustomersData] = React.useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { customers = [], ...initialQuery } = customersData;
  const [customersQuery, setCustomersQuery] = React.useState({
    page: Number(searchParams.get("page")) || initialQuery.page,
    size: Number(searchParams.get("size")) || initialQuery.size,
  });
  const [loading, setLoading] = React.useState(false);
  const { isOpen: isCreateCustomerOpen, onOpen: onCreateCustomerOpen, onClose: onCreateCustomerClose } = useDisclosure();

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
      header: "Company Name",
      accessor: "company_name",
    },
    {
      header: "Address",
      accessor: "address",
    },
    {
      header: "Incharge Name",
      accessor: "incharge",
    },
    {
      header: "Phone Number",
      accessor: "phone_number",
    },
    {
      header: "Actions",
      accessor: "actions",
      cellRenderer: (params) => <GetEditForm {...params.data} />,
    },
  ];

  const GetEditForm = (props) => {
    const { isOpen: isEditCustomerOpen, onOpen: onEditCustomerOpen, onClose: onEditCustomerClose } = useDisclosure();
    return (
      <Box>
        <Button size="xs" onClick={() => onEditCustomerOpen()}>
          Edit Customer
        </Button>
        <Modal isOpen={isEditCustomerOpen} onClose={onEditCustomerClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Customer</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CustomerForm {...props} onClose={onEditCustomerClose} pageRefresher={fetchCustomers} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };

  const rowData = React.useMemo(() => {
    let customersClone = customers && customers.slice();
    return customersClone.map((c, i) => ({
      ...c,
      sno: (initialQuery.page - 1) * initialQuery.size + i + 1,
      name: c.name || "-",
    }));
  }, [customers]);

  const fetchCustomers = (query = {}) => {
    setLoading(true);
    api
      .get(CUSTOMERS + "?" + new URLSearchParams(query))
      .then((response) => {
        setCustomersData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  const handlePaginationChange = ({ page = customersQuery.page, size = customersQuery.size }) => {
    if (page !== customersQuery.page) setCustomersQuery({ ...customersQuery, page });
    if (size !== customersQuery.size) setCustomersQuery({ ...customersQuery, page: 1, size: size });
    return;
  };

  React.useEffect(() => {
    const { page = 1, size = 50 } = customersQuery;
    setSearchParams({ page, size });
    fetchCustomers({ page, size });
  }, [customersQuery]);

  return (
    <Layout>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Box>
          <Button onClick={() => onCreateCustomerOpen()}>Create Customer</Button>
          <Modal isOpen={isCreateCustomerOpen} onClose={onCreateCustomerClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Customer</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <CustomerForm onClose={onCreateCustomerClose} pageRefresher={fetchCustomers} />
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

export default ViewCustomers;
