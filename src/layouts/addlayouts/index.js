import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useMaterialUIController } from "context";
import { Grid, Card, Table, TableRow, TableCell, Checkbox } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Dropdown from "./components/DropDown";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Switch from "@mui/material/Switch";
import FormDialog from "./components/FormDialog";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./components/SortableItem";
import { useNavigate, useParams } from "react-router-dom";

function AddLayouts() {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;
  const navigate = useNavigate();
  const { layout_id } = useParams();
  const [layoutId, setLayoutId] = useState(layout_id || "");
  const [loader, setLoader] = useState(true);
  const [layoutData, setLayoutData] = useState({});
  const [selectedLayout, setSelectedLayout] = useState({
    size: { size_name: "", size_id: "", size_image: "" },
    color: { color_name: "", color_id: "", color_image: "" },
    headboard: { headboard_name: "", headboard_id: "", headboard_image: "" },
    basedepth: { basedepth_name: "", basedepth_id: "", basedepth_image: "" },
    storage: { storage_name: "", storage_id: "", storage_image: "" },
  });

  const [allDropdownsSelected, setAllDropdownsSelected] = useState(false);
  const [allImagesSelected, setAllImagesSelected] = useState(false);

  const fetchLayout = async () => {
    if (layoutId) {
      try {
        const response = await axios.get(`http://localhost:4000/layouts/layouts`);
        if (response.status === 200) {
          setLayoutData(response.data);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoader(false);
      }
    } else {
      try {
        const response = await axios.get(`http://localhost:4000/layouts/layouts`);
        if (response.status === 200) {
          setLayoutData(response.data);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    fetchLayout();
  }, []);

  const handleSelect = (option, key) => {
    setSelectedLayout((prevState) => ({
      ...prevState,
      [key]: {
        [`${key}_name`]: option.label,
        [`${key}_id`]: option.value,
        [`${key}_image`]: option.image,
      },
    }));
  };

  useEffect(() => {
    const allSelected = Object.keys(selectedLayout).every((key) => {
      return selectedLayout[key][`${key}_id`] !== "";
    });

    setAllDropdownsSelected(allSelected);
  }, [selectedLayout]);

  const [displayNext, setDisplayNext] = useState(false);
  const [display, setDisplay] = useState(false);
  const handleNextButtonClick = async () => {
    try {
      const filteredLayout = Object.keys(selectedLayout).reduce((acc, key) => {
        acc[key] = selectedLayout[key][`${key}_id`];
        return acc;
      }, {});
      const url = `http://localhost:4000/layouts/check_layout`;
      const result = await axios.post(url, filteredLayout);
      if (result.status === 200 && result.data) {
        const getUrl = `http://localhost:4000/image_layout/get_layout/${result.data.data.layout_id}`;
        const response = await axios.get(getUrl);
        if (response.status === 200 && response.data) {
          setParts(() => {
            const data = response.data.data.map((item) => {
              const object = {
                id: item.id,
                key: item.image_data,
                image_id: item.image_id,
              };
              return object;
            });
            return data;
          });
          setLayoutId(result.data.data.layout_id);
          setDisplay(!allDropdownsSelected);
          setDisplayNext(allDropdownsSelected);
        } else {
          setParts(defaultParts);
        }
      } else {
        setDisplay(!allDropdownsSelected);
        setDisplayNext(allDropdownsSelected);
        setParts(defaultParts);
      }
    } catch (error) {
      console.error(error.message);
      setParts(defaultParts);
    }
  };

  const [isOpen, setIsOpen] = useState(true);

  const tableHeader = ["image", "name", "is open", "is close", "remove"];
  const defaultParts = [
    {
      image_id: "",
      id: 1,
      key: {
        name: "shadow",
        url: "",
        file: "",
        isOpen: true,
        isClose: true,
      },
    },
    {
      image_id: "",
      id: 2,
      key: {
        name: "legs",
        url: "",
        file: "",
        isOpen: true,
        isClose: true,
      },
    },
    {
      image_id: "",
      id: 3,
      key: {
        name: "headboard",
        url: "",
        file: "",
        isOpen: true,
        isClose: true,
      },
    },
    {
      image_id: "",
      id: 4,
      key: {
        name: "bedbase",
        url: "",
        file: "",
        isOpen: true,
        isClose: true,
      },
    },
    // {
    //   image_id: "",
    //   id: 5,
    //   key: {
    //     name: "back drawer close",
    //     url: "",
    //     file: "",
    //     isOpen: false,
    //     isClose: true,
    //   },
    // },
    // {
    //   image_id: "",
    //   id: 6,
    //   key: {
    //     name: "front drawer close",
    //     url: "",
    //     file: "",
    //     isOpen: false,
    //     isClose: true,
    //   },
    // },
    // {
    //   image_id: "",
    //   id: 7,
    //   key: {
    //     name: "back drawer open",
    //     url: "",
    //     file: "",
    //     isOpen: true,
    //     isClose: false,
    //   },
    // },
    // {
    //   image_id: "",
    //   id: 8,
    //   key: {
    //     name: "front drawer open",
    //     url: "",
    //     file: "",
    //     isOpen: true,
    //     isClose: false,
    //   },
    // },
  ];

  const [name, setName] = useState("");
  const [parts, setParts] = useState(defaultParts);

  const handleAddPart = () => {
    const newName = name.trim();

    if (typeof newName !== "undefined" && newName !== "") {
      const isDuplicate = parts.some(
        (part) =>
          part.key.name &&
          part.key.name.toString().toLowerCase() === newName.toString().toLowerCase()
      );

      if (!isDuplicate) {
        setParts((prevState) => [
          ...prevState,
          {
            image_id: "",
            id: prevState.length + 1,
            key: {
              name: newName,
              url: "",
              file: "",
              isOpen: false,
              isClose: false,
            },
          },
        ]);
        setName("");
      } else {
        alert("Duplicate name.");
      }
    } else {
      alert("Name cannot be empty.");
    }
  };

  useEffect(() => {
    const allSelected = parts.every((part) => {
      return part.key.url !== "";
    });

    setAllImagesSelected(allSelected);
  }, [parts]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState("");
  const toggleModal = (key) => {
    if (!modalKey) {
      setModalKey(key);
    } else {
      setModalKey("");
    }
    setModalOpen(!modalOpen);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setParts((items) => {
        const activeIndex = items.findIndex((item) => item?.id === active?.id);
        const overIndex = items.findIndex((item) => item?.id === over?.id);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  }

  const handleChange = (id, property) => {
    setParts((prevState) =>
      prevState.map((part) => {
        if (part.id === id) {
          return {
            ...part,
            key: {
              ...part.key,
              [property]: !part.key[property],
            },
          };
        }
        return part;
      })
    );
  };

  const handleSubmit = async () => {
    if (!layoutId) {
      try {
        const object = {
          layout_id: "",
          image_ids: [],
        };
        const filteredLayout = Object.keys(selectedLayout).reduce((acc, key) => {
          acc[key] = selectedLayout[key][`${key}_id`];
          return acc;
        }, {});
        const layoutUrl = `http://localhost:4000/layouts/layouts`;
        const result = await axios.post(layoutUrl, filteredLayout);
        if (result.status === 200 && result.data) {
          object.layout_id = result.data.data.layout_id;
          const filteredImageLayouts = parts.map((item, index) => {
            const data = {
              id: index,
              image_data: item.key,
            };
            return data;
          });
          for (const item of filteredImageLayouts) {
            const file = item.image_data.file;
            const fileData = new FormData();
            fileData.append("file", file);
            const timestamp = Date.now();
            const uniqueId = `${timestamp}`;
            const name = item.image_data.name + uniqueId;

            const response = await axios.post(
              `http://localhost:4000/images/insert/${name}`,
              fileData
            );
            if (response.status === 200) {
              item.image_data["url"] = response.data.url;
            }
          }
          const imageurl = `http://localhost:4000/images/images`;
          const response = await axios.post(imageurl, filteredImageLayouts);
          if (response.status === 200 && response.data) {
            const imageIds = response.data.data.map((item) => item.image_id);
            object.image_ids.push(...imageIds);

            const imageLayouturl = `http://localhost:4000/image_layout/image_layout`;
            const finalResponse = await axios.post(imageLayouturl, object);
            if (finalResponse.status === 200 && finalResponse.data) {
              // alert("Image Added Successfully");
              // navigate("/beds");
              window.location.reload();
            } else {
              alert("Something Wrong!");
            }
          } else {
            alert("Something Wrong!");
          }
        } else {
          alert("Something Wrong!");
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      alert("update");
    }
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
              >
                <MDTypography variant="h6" color="white">
                  Add New Image
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography px={3} pb={1} pt={3} variant="h6" color="dark">
                  Select Bed Layouts
                </MDTypography>
                <hr />
                <MDBox
                  px={1}
                  pt={3}
                  pb={3}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {Object.entries(layoutData).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-around" }}>
                      <MDTypography variant="h6" color="dark" px={2}>
                        {key}
                      </MDTypography>
                      <Dropdown
                        options={[
                          ...layoutData[key].map((item) => ({
                            label: item[`${key}_name`],
                            value: item[`${key}_id`],
                            image: item[`${key}_image`],
                            selected: item[`${key}_id`] === selectedLayout[key][`${key}_id`],
                          })),
                        ]}
                        onSelect={(option) => handleSelect(option, key)}
                        toggle={() => toggleModal(key)}
                      />
                    </div>
                  ))}
                </MDBox>
              </MDBox>
              {display && (
                <MDBox px={4} pb={1}>
                  <MDTypography
                    variant="h6"
                    color="error"
                    style={{ float: "right", display: "flex" }}
                  >
                    Select all layouts
                  </MDTypography>
                </MDBox>
              )}
              <MDBox px={4} pb={4}>
                <MDButton
                  style={{ float: "right", display: "flex" }}
                  variant="gradient"
                  color={sidenavColor}
                  onClick={handleNextButtonClick}
                >
                  Next
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox>
        {displayNext && (
          <MDBox pb={3}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    pt={3}
                    px={2}
                    pb={1}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <MDTypography variant="h6">Add Images</MDTypography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Switch
                        checked={isOpen}
                        onChange={() => setIsOpen(!isOpen)}
                        style={{ color: isOpen ? "green" : "red" }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      <MDTypography>{isOpen ? "Open" : "Closed"}</MDTypography>
                    </div>
                  </MDBox>
                  <hr />
                  <Grid container pb={3} spacing={6} px={5} pt={3}>
                    <Grid item xl={7} lg={7}>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext items={parts} strategy={verticalListSortingStrategy}>
                          <Table>
                            <TableRow>
                              <TableCell></TableCell>
                              {tableHeader.map((item, index) => (
                                <TableCell key={index}>
                                  <MDTypography
                                    style={{
                                      textAlign: "left",
                                      textTransform: "uppercase",
                                      fontWeight: "1000",
                                      fontSize: "18px",
                                    }}
                                  >
                                    {item}
                                  </MDTypography>
                                </TableCell>
                              ))}
                            </TableRow>
                            {parts.map((part, index) => (
                              <>
                                <TableRow key={index}>
                                  <TableCell>
                                    <SortableItem
                                      part={part}
                                      key={index}
                                      data={part}
                                      id={part.id}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <MDTypography
                                      style={{
                                        textAlign: "left",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      <span
                                        onClick={() =>
                                          document.getElementById(part.key.name).click()
                                        }
                                        style={{ cursor: "pointer" }}
                                      >
                                        {part.key.url !== "" ? "-" : "+"}
                                      </span>
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell>
                                    <MDInput
                                      type="file"
                                      id={part.key.name}
                                      name="image"
                                      accept="image/*"
                                      multiple={false}
                                      style={{ display: "none" }}
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          const blobUrl = URL.createObjectURL(file);
                                          setParts((prevState) =>
                                            prevState.map((item) => {
                                              if (item.id === part.id) {
                                                return {
                                                  ...item,
                                                  key: {
                                                    ...item.key,
                                                    file: file,
                                                    url: blobUrl,
                                                  },
                                                };
                                              }
                                              return item;
                                            })
                                          );
                                        }
                                      }}
                                    />
                                    <MDTypography
                                      style={{
                                        textAlign: "left",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      <span
                                        onClick={() =>
                                          document.getElementById(part.key.name).click()
                                        }
                                        style={{ cursor: "pointer" }}
                                      >
                                        {part.key.name}
                                      </span>
                                    </MDTypography>
                                  </TableCell>
                                  <TableCell>
                                    <Checkbox
                                      checked={part.key.isOpen}
                                      name="checkbox1"
                                      onChange={() => handleChange(part.id, "isOpen")}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Checkbox
                                      checked={part.key.isClose}
                                      name="checkbox2"
                                      onChange={() => handleChange(part.id, "isClose")}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <CloseIcon
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setParts((prevState) => {
                                          const newState = prevState.filter(
                                            (item) => item.id !== part.id
                                          );
                                          newState.forEach((item, index) => {
                                            item.id = index + 1;
                                          });
                                          return newState;
                                        });
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              </>
                            ))}
                          </Table>
                        </SortableContext>
                      </DndContext>
                      <MDBox my={1}>
                        <MDInput
                          type="text"
                          id="add"
                          name="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <MDButton
                          style={{ margin: "0 10px" }}
                          variant="gradient"
                          color="success"
                          onClick={handleAddPart}
                        >
                          <CheckIcon />
                        </MDButton>
                      </MDBox>
                    </Grid>
                    <Grid item xl={5} lg={5}>
                      <MDBox style={{ width: "500px", height: "500px" }}>
                        {parts.map((part, index) => (
                          <span key={index}>
                            {(part.key.isClose && part.key.isOpen) ||
                            (part.key.isClose && !part.key.isOpen && !isOpen) ||
                            (!part.key.isClose && part.key.isOpen && isOpen) ? (
                              part.key.url && part.key.file ? (
                                <img
                                  src={part.key.url}
                                  alt={part.key.name}
                                  style={{
                                    position: "absolute",
                                    width: "500px",
                                    height: "500px",
                                  }}
                                />
                              ) : (
                                part.key.url && (
                                  <img
                                    src={require(`../../../src/${part.key.url}`)}
                                    alt={part.key.name}
                                    style={{
                                      position: "absolute",
                                      width: "500px",
                                      height: "500px",
                                    }}
                                  />
                                )
                              )
                            ) : null}
                          </span>
                        ))}
                      </MDBox>
                    </Grid>
                  </Grid>
                  {allImagesSelected && (
                    <MDBox px={4} pb={4}>
                      <MDButton
                        style={{ float: "right", display: "flex" }}
                        variant="gradient"
                        color={layoutId ? "warning" : sidenavColor}
                        onClick={handleSubmit}
                      >
                        {layoutId ? "Update" : "Done"}
                      </MDButton>
                    </MDBox>
                  )}
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        )}
      </MDBox>
      <FormDialog
        isOpen={modalOpen}
        toggle={toggleModal}
        fetchLayout={fetchLayout}
        uniqueKey={modalKey}
      ></FormDialog>
    </DashboardLayout>
  );
}

export default AddLayouts;
