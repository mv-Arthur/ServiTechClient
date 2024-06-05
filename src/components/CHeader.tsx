import { observer } from "mobx-react-lite";

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "..";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import Drawer from "@mui/material/Drawer";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import { RoleType } from "../models/RoleType";
import ApartmentIcon from "@mui/icons-material/Apartment";
const CHeader = () => {
	const [open, setOpen] = React.useState(false);
	const { store } = useContext(Context);
	const navigate = useNavigate();
	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};
	const DrawerList = (
		<Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/types")}>
						<ListItemIcon>
							{" "}
							<TypeSpecimenIcon />
						</ListItemIcon>
						<ListItemText primary={"Типы"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/user")}>
						<ListItemIcon>
							{" "}
							<SupervisedUserCircleIcon />
						</ListItemIcon>
						<ListItemText primary={"Пользователи"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/office")}>
						<ListItemIcon>
							{" "}
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary={"Личный кабинет"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/organization")}>
						<ListItemIcon>
							{" "}
							<ApartmentIcon />
						</ListItemIcon>
						<ListItemText primary={"О компании"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	const OperatorDrawnerList = (
		<Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/types")}>
						<ListItemIcon>
							{" "}
							<TypeSpecimenIcon />
						</ListItemIcon>
						<ListItemText primary={"Типы"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/user")}>
						<ListItemIcon>
							{" "}
							<SupervisedUserCircleIcon />
						</ListItemIcon>
						<ListItemText primary={"Заявки"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/office")}>
						<ListItemIcon>
							{" "}
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary={"Личный кабинет"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/organization")}>
						<ListItemIcon>
							{" "}
							<ApartmentIcon />
						</ListItemIcon>
						<ListItemText primary={"О компании"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	const DrawerListUser = (
		<Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/types")}>
						<ListItemIcon>
							{" "}
							<TypeSpecimenIcon />
						</ListItemIcon>
						<ListItemText primary={"Услуги"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/user")}>
						<ListItemIcon>
							{" "}
							<SupervisedUserCircleIcon />
						</ListItemIcon>
						<ListItemText primary={"Заявки"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/office")}>
						<ListItemIcon>
							{" "}
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary={"Личный кабинет"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/organization")}>
						<ListItemIcon>
							{" "}
							<ApartmentIcon />
						</ListItemIcon>
						<ListItemText primary={"О компании"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	const DrawnerListAcc = (
		<Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
			<List>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/types")}>
						<ListItemIcon>
							{" "}
							<TypeSpecimenIcon />
						</ListItemIcon>
						<ListItemText primary={"Услуги"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/user")}>
						<ListItemIcon>
							{" "}
							<SupervisedUserCircleIcon />
						</ListItemIcon>
						<ListItemText primary={"Отчеты"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/office")}>
						<ListItemIcon>
							{" "}
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary={"Личный кабинет"} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton onClick={() => navigate("/organization")}>
						<ListItemIcon>
							{" "}
							<ApartmentIcon />
						</ListItemIcon>
						<ListItemText primary={"О компании"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	const choise = (role: RoleType) => {
		if (role === "user") return "Пользователь";
		if (role === "accounting") return "Бухгалтер";
		if (role === "admin") return "Администратор";
		if (role === "operator") return "Оператор";
	};

	const choiseT = (role: RoleType) => {
		if (role === "user") return DrawerListUser;
		if (role === "accounting") return DrawnerListAcc;
		if (role === "admin") return DrawerList;
		if (role === "operator") return OperatorDrawnerList;
	};

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
						onClick={toggleDrawer(true)}
					>
						<MenuIcon />
					</IconButton>

					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Приветствую, вы авторизованы как {store.user.email}
						<Typography>{choise(store.user.role)}</Typography>
						<Typography>
							{store.user.isActivated
								? "подтвержденный аккаунт"
								: "пожалуйста, перейдите на почту и подтвердите аккаунт"}
						</Typography>
					</Typography>
					<Button
						color="inherit"
						onClick={async () => {
							await store.logout();
							navigate("/");
						}}
					>
						выход
					</Button>
				</Toolbar>
			</AppBar>
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{choiseT(store.user.role)}
			</Drawer>
		</div>
	);
};

export default observer(CHeader);
