import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useEffect, useState } from "react";
import axios from "axios";
import sizeIcon from "../../assets/images/icons/UserMenu/size.svg";
import colorIcon from "../../assets/images/icons/UserMenu/colour.svg";
import headboardIcon from "../../assets/images/icons/UserMenu/headboard.svg";
import depthIcon from "../../assets/images/icons/UserMenu/depth.svg";
import storageIcon from "../../assets/images/icons/UserMenu/storage.svg";

function Dashboard() {
  const [countData, setCountData] = useState({
    size: {
      icon: sizeIcon,
      color: "error",
      count: null,
    },
    color: {
      icon: colorIcon,
      color: "success",
      count: null,
    },
    headboard: {
      icon: headboardIcon,
      color: "primary",
      count: null,
    },
    basedepth: {
      icon: depthIcon,
      color: "info",
      count: null,
    },
    storage: {
      icon: storageIcon,
      color: "warning",
      count: null,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/layouts/counts`);
        if (response.status === 200 && response.data) {
          setCountData((prevLayouts) => ({
            ...prevLayouts,
            size: { ...prevLayouts.size, count: response.data.size },
            color: { ...prevLayouts.color, count: response.data.color },
            headboard: { ...prevLayouts.headboard, count: response.data.headboard },
            basedepth: { ...prevLayouts.basedepth, count: response.data.basedepth },
            storage: { ...prevLayouts.storage, count: response.data.storage },
          }));
        }
      } catch (error) {
        colsole.error(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} mb={3} style={{ display: "flex", justifyContent: "center" }}>
          {Object.entries(countData).map(([key, value]) => (
            <Grid item xs={12} mx={3} md={6} lg={3} key={key}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color={value.color}
                  icon={value.icon}
                  title={key}
                  count={value.count}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
