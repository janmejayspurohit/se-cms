import React from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import { Box, Flex, Select, Stack, Text } from "@chakra-ui/react";
import { indianCurrencyText } from "../../utils/commonUtil";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Button from "./Button";

function AgGrid(props) {
  const {
    data,
    setGridApi,
    setGridColumnApi,
    columns,
    filter = false,
    pagination = false,
    sizeOptions = [50, 100, 200],
    handlePaginationChange,
    pageCount,
    pageIndex = 0,
    pageSize = 50,
    manualPagination = false,
    rowHeight = 50,
  } = props;

  const onGridReady = (props) => {
    setGridApi && setGridApi(props.api);
    setGridColumnApi && setGridColumnApi(props.columnApi);
  };

  const renderPagination = () => {
    return (
      <Stack isInline alignItems="center" mb="3">
        <Button size="sm" onClick={() => handlePaginationChange({ page: 1 })} disabled={pageIndex === 1}>
          <FaAngleDoubleLeft />
        </Button>
        <Button size="sm" onClick={() => handlePaginationChange({ page: pageIndex - 1 })} disabled={pageIndex === 1}>
          <FaAngleLeft />
        </Button>
        <Text fontWeight="bold">
          {pageIndex} of {pageCount}
        </Text>
        <Button size="sm" onClick={() => handlePaginationChange({ page: pageIndex + 1 })} disabled={pageIndex === pageCount}>
          <FaAngleRight />
        </Button>
        <Button size="sm" onClick={() => handlePaginationChange({ page: pageCount })} disabled={pageIndex === pageCount}>
          <FaAngleDoubleRight />
        </Button>
      </Stack>
    );
  };

  return (
    <Box h="100%" w="100%" my="1em" pb="1.5em">
      <Flex justifyContent="space-between" alignItems="center">
        {manualPagination ? renderPagination() : <Stack></Stack>}
        <Stack isInline alignItems="center" mb="3">
          <Select width="auto" bg="gray.100" value={pageSize} onChange={(e) => handlePaginationChange({ size: Number(e.target.value) })}>
            {sizeOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Stack>
      </Flex>
      <Box h="100%" w="100%" id="myGrid" className="ag-theme-alpine">
        <AgGridReact
          rowHeight={rowHeight}
          stopEditingWhenCellsLoseFocus={true}
          pagination={pagination}
          paginationAutoPageSize={pagination}
          animateRows={true}
          defaultColDef={{
            width: 200,
            filter: filter ? "agTextColumnFilter" : false,
            resizable: true,
            headerClass: "ag-grid-custom-header",
          }}
          columnTypes={{
            filterableColumn: {
              filter: "agTextColumnFilter",
            },
            sortableColumn: {
              sortable: true,
              unSortIcon: true,
            },
            currencyColumn: {
              valueFormatter: (props) => indianCurrencyText(props.value),
            },
            numberColumn: {
              width: 130,
              filter: filter ? "agNumberColumnFilter" : false,
            },
            editableColumn: { editable: true },
            dateColumn: {
              filter: filter ? "agDateColumnFilter" : false,
              filterParams: {
                comparator: function (filterLocalDateAtMidnight, cellValue) {
                  var dateParts = cellValue.split("/");
                  var day = Number(dateParts[0]);
                  var month = Number(dateParts[1]) - 1;
                  var year = Number(dateParts[2]);
                  var cellDate = new Date(year, month, day);
                  if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                  } else if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                  } else {
                    return 0;
                  }
                },
              },
            },
          }}
          rowData={data}
          onGridReady={onGridReady}
        >
          {columns?.length > 0 &&
            columns.map((c) => (
              <AgGridColumn
                cellRenderer={c.cellRenderer}
                key={`my-grid-col-${c.header}-for-${c.accessor}-${c.type}`}
                headerName={c.header}
                field={c.accessor}
                type={c.type || ""}
                width={c.width || 180}
                pinned={c.pinned || ""}
              />
            ))}
        </AgGridReact>
      </Box>
    </Box>
  );
}

export default AgGrid;
