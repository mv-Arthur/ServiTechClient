import { Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { CreateTypeForm } from "../components/createTypeForm/CreateTypeForm";
import { TypesArea } from "../components/typesArea/TypesArea";

import { observer } from "mobx-react-lite";
import { typeStore } from "../store/typeStore";
import { Context } from "..";
import { orderStore } from "../store/orderStore";

type PropsType = {
	isAdmin: boolean;
};

export const TypesPage: React.FC<PropsType> = observer(({ isAdmin }) => {
	const { store } = useContext(Context);
	React.useEffect(() => {
		(async () => {
			await store.checkAuth();
			await typeStore.fetchTypes();
		})();
	});

	let choise = null;

	if (isAdmin)
		choise = (
			<Container>
				<CreateTypeForm />

				<TypesArea />
			</Container>
		);
	else
		choise = (
			<Container>
				<Typography style={{ marginTop: "10px" }} variant="h4">
					Поддерживаемые услуги
				</Typography>
				<Typography>цена может меняться в зависимости от сложности и обьема работ</Typography>

				<TypesArea user />
			</Container>
		);

	return <div>{choise}</div>;
});
