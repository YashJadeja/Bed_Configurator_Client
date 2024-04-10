import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import PropTypes from "prop-types";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import authorsTableData from "layouts/tables/data/authorsTableData";
import { useMaterialUIController } from "context";
import FormDialog from "layouts/addlayouts/components/FormDialog";
import { useState } from "react";
import MDButton from "components/MDButton";

function Tables({ collection }) {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState("");
  const [modalData, setModalData] = useState({});

  const toggleModal = (key, data) => {
    if (!modalKey) {
      setModalKey(key);
      if (data) {
        setModalData(data);
      }
    } else {
      setModalKey("");
      setModalData({});
    }
    setModalOpen(!modalOpen);
  };

  const handleEdit = (layout, collection) => {
    const data = {
      name: layout[`${collection}_name`],
      image: layout[`${collection}_image`],
      id: layout[`${collection}_id`],
    };
    toggleModal(collection, data);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor={sidenavColor}
                borderRadius="lg"
                coloredShadow={sidenavColor}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <MDTypography variant="h6" color="white">
                  {collection} Table
                </MDTypography>
                <MDButton
                  color="secondary"
                  variant="gradient"
                  onClick={() => toggleModal(collection)}
                >
                  Add New {collection}
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={authorsTableData(collection, handleEdit)}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {modalData && (
        <FormDialog
          isOpen={modalOpen}
          toggle={toggleModal}
          fetchLayout={(collection) => authorsTableData(collection, handleEdit)}
          uniqueKey={modalKey}
          data={modalData}
        ></FormDialog>
      )}
    </DashboardLayout>
  );
}

Tables.propTypes = {
  collection: PropTypes.string.isRequired,
};

export default Tables;
