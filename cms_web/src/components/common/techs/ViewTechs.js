import { Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AgGrid } from "..";
import { TECHS } from "../../../constants/apiRoutes";
import api from "../../../services/api";
import { formattedErrorMessage } from "../../../utils/formattedErrorMessage";
import useCustomToastr from "../../../utils/useCustomToastr";
import Button from "../Button";
import CustomSpinner from "../CustomSpinner";
import Layout from "../Layout";
import TechForm from "./TechForm";

const ViewTechs = () => {
  const toast = useCustomToastr();
  const [techsData, setTechsData] = React.useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { techs = [], ...initialQuery } = techsData;
  const [techsQuery, setTechsQuery] = React.useState({
    page: Number(searchParams.get("page")) || initialQuery.page,
    size: Number(searchParams.get("size")) || initialQuery.size,
  });
  const [loading, setLoading] = React.useState(false);
  const { isOpen: isCreateTechOpen, onOpen: onCreateTechOpen, onClose: onCreateTechClose } = useDisclosure();

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
      header: "Technology",
      accessor: "name",
    },
    {
      header: "Active",
      accessor: "is_active",
      cellRenderer: (params) => (params.value ? "Yes" : "No"),
    },
    {
      header: "Actions",
      accessor: "actions",
      cellRenderer: (params) => <GetEditForm {...params.data} />,
    },
  ];

  const GetEditForm = (props) => {
    const { isOpen: isEditTechOpen, onOpen: onEditTechOpen, onClose: onEditTechClose } = useDisclosure();
    return (
      <Box>
        <Button size="xs" onClick={() => onEditTechOpen()}>
          Edit Tech
        </Button>
        <Modal isOpen={isEditTechOpen} onClose={onEditTechClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Tech</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TechForm {...props} onClose={onEditTechClose} pageRefresher={fetchTechs} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };

  const rowData = React.useMemo(() => {
    let techsClone = techs && techs.slice();
    return techsClone.map((t, i) => ({
      ...t,
      sno: (initialQuery.page - 1) * initialQuery.size + i + 1,
      name: t.name || "-",
    }));
  }, [techs]);

  const fetchTechs = (query = {}) => {
    setLoading(true);
    api
      .get(TECHS + "?" + new URLSearchParams(query))
      .then((response) => {
        setTechsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const e = formattedErrorMessage(error);
        toast.showError(e);
        setLoading(false);
      });
  };

  const handlePaginationChange = ({ page = techsQuery.page, size = techsQuery.size }) => {
    if (page !== techsQuery.page) setTechsQuery({ ...techsQuery, page });
    if (size !== techsQuery.size) setTechsQuery({ ...techsQuery, page: 1, size: size });
    return;
  };

  React.useEffect(() => {
    const { page = 1, size = 50 } = techsQuery;
    setSearchParams({ page, size });
    fetchTechs({ page, size });
  }, [techsQuery]);

  return (
    <Layout>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Box>
          <Button onClick={() => onCreateTechOpen()}>Create Tech</Button>
          <Modal isOpen={isCreateTechOpen} onClose={onCreateTechClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Tech</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <TechForm onClose={onCreateTechClose} pageRefresher={fetchTechs} />
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

export default ViewTechs;
