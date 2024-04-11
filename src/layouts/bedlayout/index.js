import MDBox from "components/MDBox";
import PageLayout from "examples/LayoutContainers/PageLayout";
import React, { useEffect, useState } from "react";
import sizeIcon from "../../assets/images/icons/UserMenu/size.svg";
import colorIcon from "../../assets/images/icons/UserMenu/colour.svg";
import headboardIcon from "../../assets/images/icons/UserMenu/headboard.svg";
import depthIcon from "../../assets/images/icons/UserMenu/depth.svg";
import storageIcon from "../../assets/images/icons/UserMenu/storage.svg";
import LayoutDropdown from "layouts/bedlayout/components/LayoutDropdown";
import axios from "axios";
import MDTypography from "components/MDTypography";
import Switch from "@mui/material/Switch";
import logo from "../../assets/images/icons/UserMenu/bedbg1.png";
import logo2 from "../../assets/images/icons/UserMenu/bedbg2.svg";

const BedLayout = () => {
  const [layouts, setLayouts] = useState({
    size: {
      icon: sizeIcon,
      selectedId: "",
    },
    color: {
      icon: colorIcon,
      selectedId: "",
    },
    headboard: {
      icon: headboardIcon,
      selectedId: "",
    },
    basedepth: {
      icon: depthIcon,
      selectedId: "",
    },
    storage: {
      icon: storageIcon,
      selectedId: "",
    },
  });

  const [layoutIdData, setLayoutIdData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://bed-configurator-client-wine.vercel.app/api/image_layout/all_beds`
        );
        if (response.status === 200 && response.data.data) {
          const layoutData = response.data.data[0].layout;

          setLayouts((prevLayouts) => ({
            ...prevLayouts,
            size: { ...prevLayouts.size, selectedId: layoutData.size },
            color: { ...prevLayouts.color, selectedId: layoutData.color },
            headboard: { ...prevLayouts.headboard, selectedId: layoutData.headboard },
            basedepth: { ...prevLayouts.basedepth, selectedId: layoutData.basedepth },
            storage: { ...prevLayouts.storage, selectedId: layoutData.storage },
          }));

          const imageData = [];
          const layoutIds = [];
          for (const item of response.data.data) {
            const data = item.images.map((image) => {
              const object = {
                id: image.id,
                key: image.image_data,
                image_id: image.image_id,
              };
              return object;
            });
            imageData.push({ image_data: data, layout_id: item.layout_id });
            layoutIds.push(item.layout);
          }
          setBedData(imageData);
          setLayoutIdData(layoutIds);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const [isOpen, setIsOpen] = useState(true);
  const [layoutImages, setLayoutImages] = useState();
  const [bedData, setBedData] = useState([]);
  useEffect(() => {
    const setImageData = () => {
      for (const item of layoutIdData) {
        let match = true;
        for (const key in layouts) {
          if (layouts.hasOwnProperty(key)) {
            if (item[key] !== layouts[key].selectedId) {
              match = false;
              break;
            }
          }
        }
        if (match) {
          for (const data of bedData) {
            if (data.layout_id === item.layout_id) {
              setLayoutImages(data.image_data);
              return;
            }
          }
        }
      }
    };

    setImageData();
  }, [layouts]);

  const [expandedLayout, setExpandedLayout] = useState("");
  const openLayout = (key) => {
    setExpandedLayout(expandedLayout === key ? "" : key);
  };

  return (
    <PageLayout>
      <MDBox
        style={{ backgroundColor: "rgba(204, 203, 206, 1)", minHeight: "100vh", height: "100%" }}
      >
        <MDBox
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <MDBox
            style={{
              backgroundColor: "#84B4C8",
              zIndex: 9999,
            }}
          >
            {Object.entries(layouts).map(([key, value], index) => (
              <MDBox
                key={index}
                style={{
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => openLayout(key)}
              >
                <img
                  src={value.icon}
                  width={30}
                  height={30}
                  color="#fff"
                  style={{ margin: "20px", cursor: "pointer" }}
                />
              </MDBox>
            ))}
          </MDBox>

          {/* header */}
          <MDBox
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "start",
              width: "100%",
              height: "100%",
              zIndex: 997,
            }}
          >
            <MDBox
              style={{
                backgroundColor: "#84B4C8",
                width: "100%",
                color: "#fff",
                fontSize: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <img
                src={logo2}
                width={300}
                color="#fff"
                style={{
                  margin: "0 30px",
                  color: "#fff",
                }}
              />
            </MDBox>
          </MDBox>
        </MDBox>

        {/* expanded menu */}
        <MDBox
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
        >
          <MDBox
            style={{
              backgroundColor: "rgba(178, 217, 234, .8)",
              height: "100%",
              width: "20%",
              display: expandedLayout ? "flex" : "none",
              paddingRight: 70,
              transition: "2s ease-in-out",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {expandedLayout && (
              <LayoutDropdown
                layout={expandedLayout}
                selectedId={layouts[expandedLayout].selectedId}
                setLayouts={setLayouts}
                layouts={layouts}
              />
            )}
          </MDBox>

          {/* switch */}
          <MDBox
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bottom: 0,
              width: "100%",
            }}
          >
            <MDBox>
              <Switch
                checked={isOpen}
                onChange={() => setIsOpen(!isOpen)}
                inputProps={{ "aria-label": "controlled" }}
              />
              <MDTypography>{isOpen ? "Open" : "Closed"}</MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* bed box */}
        <MDBox
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
            maxWidth: "100vw",
            maxHeight: "100vh",
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: 0,
          }}
        >
          {layoutImages &&
            layoutImages.map((part, index) => (
              <span
                key={index}
                style={{
                  width: "80%",
                  height: "90%",
                  position: "absolute",
                  margin: 0,
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                {(part.key.isClose && part.key.isOpen) ||
                (part.key.isClose && !part.key.isOpen && !isOpen) ||
                (!part.key.isClose && part.key.isOpen && isOpen) ? (
                  part.key.url && part.key.file ? (
                    <img
                      src={part.key.url}
                      alt={part.key.name}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    part.key.url && (
                      <img
                        src={require(`../../../src/${part.key.url}`)}
                        alt={part.key.name}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )
                  )
                ) : null}
              </span>
            ))}
        </MDBox>
      </MDBox>
    </PageLayout>
  );
};

export default BedLayout;
