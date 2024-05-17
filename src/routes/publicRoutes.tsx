import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { ResetPass } from "../pages/ResetPass";

const PublicRoutes = () => {
	return (
		<Routes>
			<Route path={"/"} element={<LoginPage />} />
			<Route path={"/reset/:link"} element={<ResetPass />} />
		</Routes>
	);
};

export default PublicRoutes;
