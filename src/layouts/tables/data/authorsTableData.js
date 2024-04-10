import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";

const Author = ({ image }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <img src={image} height={100} />
  </MDBox>
);

Author.propTypes = {
  image: PropTypes.string.isRequired,
};

export default function data(collection, handleEdit) {
  const [loader, setLoader] = useState(true);
  const [layOutData, setLayoutData] = useState([]);

  const fetchLayout = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/layouts/${collection}`);
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
  }, [collection]);

  const handleDelete = async (layout, collection) => {
    try {
      const url = `http://localhost:4000/layouts/${collection}/${layout[`${collection}_id`]}`;
      const response = await axios.delete(url);
      if (response.status === 200) {
        fetchLayout();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    columns: [
      { Header: "Layout Image", accessor: "Layout Image", width: "40%", align: "left" },
      { Header: "Layout Name", accessor: "Layout Name", width: "40%", align: "left" },
      { Header: "Edit", accessor: "Edit", align: "center" },
      { Header: "Delete", accessor: "Delete", align: "right" },
    ],

    rows: layOutData.map((layout) => ({
      ["Layout Image"]: layout[`${collection}_image`] && (
        <Author image={require(`../../../../src/${layout[`${collection}_image`]}`)} />
      ),
      ["Layout Name"]: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {layout[`${collection}_name`] &&
            layout[`${collection}_name`].charAt(0).toUpperCase() +
              layout[`${collection}_name`].slice(1)}
        </MDTypography>
      ),
      Edit: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          <MDButton
            variant="gradient"
            color={"secondary"}
            onClick={() => handleEdit(layout, collection)}
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
            onClick={() => handleDelete(layout, collection)}
          >
            <DeleteIcon />
          </MDButton>
        </MDTypography>
      ),
    })),
  };
}

data.propTypes = {
  collection: PropTypes.any.isRequired,
  handleEdit: PropTypes.func.isRequired,
};
