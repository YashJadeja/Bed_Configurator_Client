import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email address").required("Email is required"),
      password: yup
        .string()
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number, and one special case Character"
        )
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `https://bed-configurator-server.onrender.com/api/users/admin`,
          values
        );
        if (response.status === 200 && response.data.data === "ok") {
          if (rememberMe) {
            localStorage.setItem("bcid", values.email);
            localStorage.setItem("bcpass", values.password);
          } else {
            localStorage.removeItem("bcid");
            localStorage.removeItem("bcpass");
          }
          localStorage.setItem("bctoken", response.data.token);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error.message);
      }
    },
  });

  useEffect(() => {
    const email = localStorage.getItem("bcid");
    const pass = localStorage.getItem("bcpass");
    if (email && pass) {
      formik.setValues({
        email: email,
        password: pass,
      });
      setRememberMe(true);
    } else {
      formik.resetForm();
    }
  }, []);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                fullWidth
              />
              {formik.errors.email && formik.touched.email ? (
                <span style={{ color: "red", fontSize: "18px" }}>{formik.errors.email}</span>
              ) : (
                ""
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                fullWidth
              />
              {formik.errors.password && formik.touched.password ? (
                <span style={{ color: "red", fontSize: "18px" }}>{formik.errors.password}</span>
              ) : (
                ""
              )}
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" onClick={formik.handleSubmit} color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
