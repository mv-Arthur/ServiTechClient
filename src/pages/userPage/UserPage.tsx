import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import { typeStore } from "../../store/typeStore";
import { CreateOrderForm } from "../../components/createOrderForm/CreateOrderForm";
import { OrderArea } from "../../components/orderArea/OrderArea";
import { orderStore } from "../../store/orderStore";
import Container from "@mui/material/Container";
import classes from "./userPage.module.css";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TypeCard } from "../../components/TypeCard";
import { operatorStore } from "../../store/operatorStore";
import { roleForGetOrdersToOperator } from "../../services/OperatorService";

const UserPage: React.FC = () => {
	const { store } = useContext(Context);
	const [parent] = useAutoAnimate();
	React.useEffect(() => {
		(async () => {
			await typeStore.fetchTypes();
			await orderStore.fetchOrders(store.user.id);
			await operatorStore.fetchToSetOrders(
				store.user.id,
				store.user.role as roleForGetOrdersToOperator
			);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={classes.body}>
			{store.isLoading ? (
				"загрузка"
			) : (
				<>
					<Container>
						<CreateOrderForm />
						<OrderArea />
						<div className={classes.currentType} ref={parent}>
							{typeStore.current.id && <TypeCard type={typeStore.current} user={true} />}
						</div>
					</Container>
				</>
			)}
		</div>
	);
};

export default observer(UserPage);
