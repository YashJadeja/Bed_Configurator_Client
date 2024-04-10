import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Grid } from "@mui/material";
import axios from "axios";

const Option = ({ data, id }) => {
  return (
    <MDBox>
      {data && (
        <MDBox mt={3}>
          <img
            style={{
              border: !data.disable && "1px solid #333",
              boxShadow: data.id === id && "2px 2px 10px",
              opacity: data.disable ? 0.3 : 1,
              backgroundColor: "#fff",
            }}
            src={require(`../../../../src/${data.image}`)}
            width={"100%"}
            height={"100%"}
          />
          <MDTypography variant="h5" color="text" style={{ textAlign: "center" }}>
            {data.name}
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
};

Option.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    disable: PropTypes.bool.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
};

const LayoutDropdown = ({ layout, setLayouts, selectedId, layouts }) => {
  const [layoutData, setLayoutData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredLayout = Object.keys(layouts).reduce((acc, key) => {
          if (key !== layout) {
            acc[key] = layouts[key].selectedId;
          }
          return acc;
        }, {});

        const response = await axios.post(
          `http://localhost:4000/layouts/${layout.toLowerCase()}`,
          filteredLayout
        );
        if (response.status === 200 && response.data) {
          const data = [];
          for (const item of response.data.data) {
            const object = {
              name: item[`${layout.toLowerCase()}_name`],
              image: item[`${layout.toLowerCase()}_image`],
              id: item[`${layout.toLowerCase()}_id`],
              disable: item.disable,
            };
            data.push(object);
          }
          setLayoutData(data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (layout) {
      fetchData();
    }
  }, [layout]);

  return (
    <MDBox>
      <MDTypography variant="h4" color="text" m={3} p={3}>
        {layoutData.map((item, index) => (
          <Grid
            item
            key={index}
            style={{
              cursor: "pointer",
              margin: "0, 10px",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => {
              if (!item.disable) {
                setLayouts((prevLayouts) => ({
                  ...prevLayouts,
                  [layout]: { ...prevLayouts[layout], selectedId: item.id },
                }));
              }
            }}
          >
            <Option data={item} id={selectedId} />
          </Grid>
        ))}
      </MDTypography>
    </MDBox>
  );
};

LayoutDropdown.propTypes = {
  layout: PropTypes.string.isRequired,
  selectedId: PropTypes.string.isRequired,
  setLayouts: PropTypes.func.isRequired,
  layouts: PropTypes.any.isRequired,
};

export default LayoutDropdown;
