import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const FormDialog = ({ isOpen, toggle, uniqueKey, fetchLayout, data }) => {
  const formFormik = useFormik({
    initialValues: {
      name: "",
      image: "",
      id: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Input Name"),
      image: yup.string().required("Add Image"),
    }),
    onSubmit: (values) => {
      handleSubmit(values.name);
    },
  });

  useEffect(() => {
    if (data && data.image) {
      const object = {
        name: data.name,
        id: data.id,
        image: `${data.image}`,
      };
      formFormik.setValues(object);

      import(`../../../../src/${data.image}`)
        .then((imageModule) => {
          const imagePath = imageModule.default;
          const file = new File([imagePath], data.image, { type: "image/jpeg" });
          setImage(file);
        })
        .catch((error) => {
          console.error("Error importing image:", error);
        });
    } else {
      formFormik.resetForm();
      setImage("");
    }
  }, [data, isOpen]);

  const handleSubmit = async (name) => {
    try {
      if (!data || !data.image) {
        const imageData = new FormData();
        imageData.append("files", image);
        const url = `https://bed-configurator-server.onrender.com/api/layouts/${uniqueKey}/${name}`;
        const response = await axios.post(url, imageData);
        if (response.status === 200) {
          formFormik.resetForm();
          setImage();
          toggle();
          fetchLayout();
        }
      } else {
        var imageUrl;
        if (!image.name.includes("uploads")) {
          const fileData = new FormData();
          fileData.append("file", image);
          const timestamp = Date.now();
          const uniqueId = `${timestamp}`;
          const name = image.name + uniqueId;

          const response = await axios.post(
            `https://bed-configurator-server.onrender.com/api/images/insert/${name}`,
            fileData
          );
          if (response.status === 200 && response.data) {
            imageUrl = response.data.url;
          }
        } else {
          imageUrl = image.name;
        }
        const url = `https://bed-configurator-server.onrender.com/api/layouts/${uniqueKey}/${name}/${data.id}`;
        const response = await axios.put(url, { url: imageUrl });
        if (response.status === 200) {
          formFormik.resetForm();
          setImage();
          toggle();
          fetchLayout();
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const [image, setImage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const modifiedFile = new File([selectedFile], selectedFile.name.replace("uploads/", ""), {
      type: selectedFile.type,
    });
    setImage(modifiedFile);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={toggle}>
        <DialogTitle>Add New {uniqueKey}</DialogTitle>
        <DialogContent pt={3}>
          <MDInput
            style={{ width: "200px" }}
            name="name"
            value={formFormik.values.name}
            onChange={formFormik.handleChange}
          />
          <MDInput
            type="file"
            id={uniqueKey}
            name="image"
            accept="image/*"
            multiple={false}
            style={{ display: "none" }}
            onChange={(e) => {
              formFormik.handleChange(e);
              handleFileChange(e);
            }}
          />
          <MDButton
            color={"info"}
            style={{ marginLeft: "15px" }}
            onClick={() => document.getElementById(uniqueKey).click()}
          >
            {image instanceof File ? "-" : "+"}
          </MDButton>
          {formFormik.touched.name && formFormik.errors.name ? (
            <div>{formFormik.errors.name}</div>
          ) : formFormik.touched.image && formFormik.errors.image ? (
            <div>{formFormik.errors.image}</div>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={formFormik.handleSubmit} color="info">
            Submit
          </MDButton>
          <MDButton onClick={toggle} color="secondary">
            Close
          </MDButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

FormDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  uniqueKey: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  fetchLayout: PropTypes.func.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default FormDialog;
