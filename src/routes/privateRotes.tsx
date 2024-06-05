import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import UserPage from "../pages/userPage/UserPage";
import { LoginPage } from "../pages/LoginPage";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import AdminPage from "../pages/AdminPage";
import CHeader from "../components/CHeader";
import { Office } from "../pages/office/Office";
import { RoleType } from "../models/RoleType";
import { AccountingPage } from "../pages/accounting/AccountingPage";
import { Organization } from "../pages/organization/Organization";
import { typeStore } from "../store/typeStore";
import { FullType } from "../pages/fullType/FullType";
import { orderAdminStore } from "../store/orderAdminStore";

import { TypesPage } from "../pages/TypesPage";
import { OperatorPage } from "../pages/operator/OperatorPage";
import { FullOrder } from "../pages/order/FullOrder";
import { io } from "socket.io-client";
import { API_URL } from "../http";
import { operatorStore } from "../store/operatorStore";
import { Chat, StatusType } from "../models/response/OperatorResponse";

const PrivateRoutes: React.FC = () => {
	const { store } = useContext(Context);
	React.useEffect(() => {
		(async () => {
			await store.checkAuth();
			await typeStore.fetchTypes();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		const newSocket = io(API_URL, {
			auth: {
				token: localStorage.getItem("token"),
			},
		});
		operatorStore.setSocket(newSocket);
		operatorStore.socket?.connect();
		console.log(operatorStore.socket);
		newSocket.on("connectt", (user) => {
			console.log("Connected as:", user);
			// Теперь вы можете использовать данные пользователя в своем приложении
		});
		if (operatorStore.socket) {
			operatorStore.socket.on(
				"set_status",
				(payload: { id: number; status: StatusType; message: string }) => {
					operatorStore.setStatus(payload.id, payload.status, payload.message);
				}
			);

			operatorStore.socket.on("set_price", (payload: { id: number; price: string }) => {
				// operatorStore.setStatus(payload.id, payload.status, payload.message);
				operatorStore.setPrice(payload.id, payload.price);
			});

			operatorStore.socket.on("send_message", (payload: { orderId: number; chat: Chat }) => {
				operatorStore.addMessage(payload.orderId, payload.chat);
				// console.log("dsad");
			});

			operatorStore.socket.on(
				"start_counter",
				(payload: { orderId: number; countvalue: string }) => {
					operatorStore.setTime(payload.orderId, payload.countvalue);
				}
			);
		}
		return () => {
			newSocket.disconnect();
		};
	}, []);

	const choise = (role: RoleType) => {
		if (role === "user") return <Route path={"/user"} element={<UserPage />} />;
		if (role === "admin") {
			(async () => await orderAdminStore.fetchingOrders())();
			return <Route path={"/user"} element={<AdminPage />} />;
		}

		if (role === "operator") {
			(async () => await orderAdminStore.fetchingOrders())();
			return <Route path={"/user"} element={<OperatorPage />} />;
		}
		if (role === "accounting") return <Route path={"/user"} element={<AccountingPage />} />;
	};

	return (
		<div>
			<CHeader />
			<Routes>
				{choise(store.user.role)}
				<Route path={"/"} element={<LoginPage />} />
				<Route path={"/office"} element={<Office />} />
				<Route path="/organization" element={<Organization role={store.user.role} />} />

				<Route path={"/types"} element={<TypesPage isAdmin={store.user.role === "admin"} />} />
				<Route path="/order/:id" element={<FullOrder />} />
				{store.user.role === "admin" && <Route path="/types/:id" element={<FullType />} />}
			</Routes>
		</div>
	);
};

export default observer(PrivateRoutes);
