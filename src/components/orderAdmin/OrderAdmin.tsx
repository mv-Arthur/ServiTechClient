import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { orderAdminStore } from "../../store/orderAdminStore";
import { API_URL } from "../../http";

import { GetAllOrdersResponse } from "../../models/response/GetAllOrdersResponse";
import classes from "./style.module.css";
import Typography from "@mui/material/Typography";
import { Context } from "../..";

import { Button } from "@mui/material";

import ArticleIcon from "@mui/icons-material/Article";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { UserArea } from "../userArea/UserArea";
import { useSnackbar, VariantType } from "notistack";
export const selected = {
	height: "30px",
	cursor: "pointer",
	width: "calc(100% - 20px)",
	backgroundColor: "#1976D2",
	borderRadius: "5px",
	paddingLeft: "10px",

	color: "#fff",
};

export const unselected = {
	height: "30px",
	cursor: "pointer",
	paddingLeft: "10px",
	width: "calc(100% - 20px)",
};

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

const findFirst = (arr: GetAllOrdersResponse[]) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].role === "user") {
			return arr[i];
		}
	}
};

const findFullfiled = (ordersForUsers: GetAllOrdersResponse[]) => {
	for (let i = 0; i < ordersForUsers.length; i++) {
		for (let j = 0; j < ordersForUsers[i].order.length; j++) {
			if (
				ordersForUsers[i].order[j].status === "resolved" ||
				ordersForUsers[i].order[j].status === "rejected"
			) {
				return true;
			}
		}
	}

	return false;
};

export const OrderAdmin = observer(() => {
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [currentUser, setCurrentUser] = React.useState<GetAllOrdersResponse>();

	const { store } = useContext(Context);
	React.useEffect(() => {
		(async () => {
			try {
				if (orderAdminStore.ordersForUsers.length) {
					setCurrentUser(findFirst(orderAdminStore.ordersForUsers));
				}
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);
	const setSnackBartoQueue = (variant: VariantType, message: string) => () => {
		enqueueSnackbar(message, { variant });
	};
	const handleDownload = (id: number) => {
		window.location.href = `${API_URL}/user/download/${id}`;
	};

	const handleGet = async (status: string, price: string, id: number) => {
		try {
			await orderAdminStore.fetchToSetStatus(id, status);
			await orderAdminStore.fetchToSetPrice(id, price);
			setCurrentUser((currentUser) => {
				return (
					currentUser && {
						...currentUser,
						order: currentUser.order.map((order) =>
							order.id === id ? { ...order, price: price, status: status } : order
						),
					}
				);
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handleValid = (user: GetAllOrdersResponse) => {
		if (currentUser && user) {
			if (currentUser.id === user.id) return selected;
			else return unselected;
		}
	};

	return (
		<>
			<div className={classes.area}>
				<div className={classes.left}>
					{orderAdminStore.ordersForUsers.map((user) => {
						if (user.id !== store.user.id) {
							return (
								<Typography
									style={{ ...unselected, ...handleValid(user) }}
									key={user.id}
									onClick={() => setCurrentUser(user)}
								>
									{user.email}
								</Typography>
							);
						} else {
							return null;
						}
					})}
				</div>

				<div className={classes.right}>
					<UserArea
						currentUser={currentUser}
						handleDownload={handleDownload}
						handleGet={handleGet}
					/>
				</div>
			</div>

			<>
				<Button
					onClick={handleOpen}
					variant="outlined"
					style={{ position: "fixed", right: 100, bottom: 50 }}
				>
					Отправить отчет <ArticleIcon style={{ marginLeft: "5px" }} />
				</Button>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<Typography id="modal-modal-title" variant="h6" component="h2">
							Отправка отчета
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							ВНИМАНИЕ! все заявки со статусом "готово к выдаче" и "отклонено" будут удалены
							из вашей рабочей области и отправлены в бухгалтерию, уверены что хотите
							продолжить?
						</Typography>
						<div style={{ position: "absolute", bottom: 20, right: 20 }}>
							<Button
								onClick={async () => {
									if (findFullfiled(orderAdminStore.ordersForUsers)) {
										await orderAdminStore.setReport();

										setCurrentUser((currentUser) => {
											if (currentUser) {
												const founded = orderAdminStore.ordersForUsers.find((user) => {
													return user.id === currentUser.id;
												});
												if (founded) return founded;
											}
										});
										handleClose();
										setSnackBartoQueue("success", "отчет успешно отправлен")();
									} else {
										setSnackBartoQueue(
											"error",
											"нет выполненных или отклоненных заявок"
										)();
									}
								}}
							>
								да
							</Button>
							<Button onClick={handleClose}>нет</Button>
						</div>
					</Box>
				</Modal>
			</>
		</>
	);
});
