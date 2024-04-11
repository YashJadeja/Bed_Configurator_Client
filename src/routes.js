import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import SignIn from "layouts/authentication/sign-in";
import BedLayout from "layouts/bedlayout";
import AddLayouts from "layouts/addlayouts";
import Icon from "@mui/material/Icon";
import Beds from "layouts/beds";
import sizeIcon from "./assets/images/icons/UserMenu/size.svg";
import colorIcon from "./assets/images/icons/UserMenu/colour.svg";
import headboardIcon from "./assets/images/icons/UserMenu/headboard.svg";
import depthIcon from "./assets/images/icons/UserMenu/depth.svg";
import storageIcon from "./assets/images/icons/UserMenu/storage.svg";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Sizes",
    key: "sizes",
    icon: <img src={sizeIcon} width={20} />,
    route: "/sizes",
    component: <Tables collection={"size"} />,
  },
  {
    type: "collapse",
    name: "Colors",
    key: "colors",
    icon: <img src={colorIcon} width={20} />,
    route: "/colors",
    component: <Tables collection={"color"} />,
  },
  {
    type: "collapse",
    name: "Headboards",
    key: "headboards",
    icon: <img src={headboardIcon} width={20} />,
    route: "/headboards",
    component: <Tables collection={"headboard"} />,
  },
  {
    type: "collapse",
    name: "Basedepths",
    key: "basedepths",
    icon: <img src={depthIcon} width={20} />,
    route: "/basedepths",
    component: <Tables collection={"basedepth"} />,
  },
  {
    type: "collapse",
    name: "Storages",
    key: "storages",
    icon: <img src={storageIcon} width={20} />,
    route: "/storages",
    component: <Tables collection={"storage"} />,
  },
  {
    type: "collapse",
    name: "Beds",
    key: "beds",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/beds",
    component: <Beds />,
  },
  {
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "divider",
    name: "User",
    key: "users",
    route: "/bed_configurator",
    component: <BedLayout />,
  },
  {
    type: "form",
    name: "Add Beds",
    key: "add-beds",
    route: "/add-beds",
    component: <AddLayouts />,
  },
  {
    type: "form",
    name: "Add Beds",
    key: "add-beds",
    route: "/add-beds/:layout_id",
    component: <AddLayouts />,
  },
];

export default routes;
