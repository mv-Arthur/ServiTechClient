import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import UserPage from "../pages/userPage/UserPage";

import PublicRoutes from "./publicRoutes";
import PrivateRoutes from "./privateRotes";

type PropsType = {
	isAuth: boolean;
};

const CustomRouter: React.FC<PropsType> = (props) => {
	const { store } = useContext(Context);

	return <>{props.isAuth ? <PrivateRoutes /> : <PublicRoutes />}</>;
};

export default observer(CustomRouter);
