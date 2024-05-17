import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import UserPage from "../pages/userPage/UserPage";
import Container from "@mui/material/Container";
import { LoginPage } from "../pages/LoginPage";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import AdminPage from "../pages/AdminPage";
import CHeader from "../components/CHeader";
import { CreateTypeForm } from "../components/createTypeForm/CreateTypeForm";
import { TypesArea } from "../components/typesArea/TypesArea";
import Typography from "@mui/material/Typography";
import { Office } from "../pages/office/Office";
import { RoleType } from "../models/RoleType";
import { AccountingPage } from "../pages/accounting/AccountingPage";
import { Organization } from "../pages/organization/Organization";
import { typeStore } from "../store/typeStore";
import { FullType } from "../pages/fullType/FullType";
import { orderAdminStore } from "../store/orderAdminStore";
import { CookiesDelete } from "../store/store";
import { TypesPage } from "../pages/TypesPage";

const PrivateRoutes: React.FC = () => {
	const { store } = useContext(Context);
	React.useEffect(() => {
		(async () => {
			await store.checkAuth();
			await typeStore.fetchTypes();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const choise = (role: RoleType) => {
		if (role === "user") return <Route path={"/user"} element={<UserPage />} />;
		if (role === "admin") {
			orderAdminStore.fetchingOrders();
			return <Route path={"/user"} element={<AdminPage />} />;
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

				{store.user.role === "admin" && <Route path="/types/:id" element={<FullType />} />}
			</Routes>
		</div>
	);
};

export default observer(PrivateRoutes);
