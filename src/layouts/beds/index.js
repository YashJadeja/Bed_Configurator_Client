import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useMaterialUIController } from "context";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";
import bedsData from "./data/bedsData";

function Beds() {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;

  const navigate = useNavigate();

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
                  Beds Table
                </MDTypography>
                <MDButton
                  color="secondary"
                  variant="gradient"
                  onClick={() => navigate("/add-beds")}
                >
                  Add New Bed
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={bedsData()}
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
    </DashboardLayout>
  );
}

export default Beds;
