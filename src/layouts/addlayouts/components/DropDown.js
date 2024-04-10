import React, { useState } from "react";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";

const Dropdown = ({ options, onSelect, toggle }) => {
  const [controller, dispatch] = useMaterialUIController();
  const { sidenavColor } = controller;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown" onClick={toggleDropdown}>
      <MDButton
        variant="gradient"
        color={sidenavColor}
        className="dropdown-toggle border"
        style={{ whiteSpace: "nowrap" }}
      >
        {options.find((option) => option.selected)?.label || "Select"}
      </MDButton>
      {isOpen && (
        <MDBox
          className="dropdown-menu"
          style={{
            zIndex: "999",
            border: "1px solid #333",
            borderRadius: "10px",
            position: "absolute",
            backgroundColor: "#fff",
          }}
        >
          {options.map((option, index) => (
            <>
              <MDButton
                style={{ textAlign: "left", whiteSpace: "nowrap" }}
                key={index}
                onClick={() => onSelect(option)}
              >
                {option.label}
              </MDButton>
              <br />
            </>
          ))}
          <MDButton style={{ textAlign: "left", whiteSpace: "nowrap" }} onClick={() => toggle()}>
            Add New
          </MDButton>
        </MDBox>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      selected: PropTypes.bool.isRequired,
      image: PropTypes.string,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Dropdown;
