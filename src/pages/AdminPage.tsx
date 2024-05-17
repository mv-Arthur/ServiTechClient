import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { orderStore } from "../store/orderStore";
import { OrderAdmin } from "../components/orderAdmin/OrderAdmin";
import { Button } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { orderAdminStore } from "../store/orderAdminStore";
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	height: 300,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};
const AdminPage = () => {
	const { store } = useContext(Context);

	React.useEffect(() => {
		(async () => {
			(async () => {
				await store.checkAuth();
				await orderStore.fetchOrders(store.user.id);
			})();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<OrderAdmin />
		</div>
	);
};

export default observer(AdminPage);
