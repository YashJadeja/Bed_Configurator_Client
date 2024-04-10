import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function bedsData() {
  const [loader, setLoader] = useState(true);
  const [layOutData, setLayoutData] = useState([]);
  const navigate = useNavigate();

  const fetchLayout = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/image_layout/get_layout`);
      if (response.status === 200) {
        setLayoutData(response.data.data);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchLayout();
  }, []);

  return {
    columns: [
      { Header: "Index", accessor: "Index", align: "left" },
      { Header: "Bed Name", accessor: "Bed Name", width: "70%", align: "center" },
      { Header: "Edit", accessor: "Edit", width: "10%", align: "center" },
      { Header: "Delete", accessor: "Delete", width: "10%", align: "center" },
    ],

    rows: layOutData.map((layout, index) => ({
      Index: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {index + 1}
        </MDTypography>
      ),
      ["Bed Name"]: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Layout {index + 1}
        </MDTypography>
      ),
      Edit: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          <MDButton
            variant="gradient"
            color={"secondary"}
            onClick={() => navigate(`/add-beds/${layout.imageLayout_id}`)}
          >
            <EditIcon />
          </MDButton>
        </MDTypography>
      ),
      Delete: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          <MDButton
            variant="gradient"
            color={"error"}
            onClick={() => handleDelete(layout.imageLayout_id)}
          >
            <DeleteIcon />
          </MDButton>
        </MDTypography>
      ),
    })),
  };
}
