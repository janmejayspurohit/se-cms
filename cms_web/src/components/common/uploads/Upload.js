import { Box, Button, Stack } from "@chakra-ui/react";
import React from "react";
import FileUploader from "../../../utils/FileUploader";
import Layout from "../Layout";

const Upload = () => {
  return (
    <Layout>
      <FileUploader type="csvUpload" />
    </Layout>
  );
};

export default Upload;
