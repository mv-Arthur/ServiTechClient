import React, { ChangeEvent, useContext } from "react";
import classes from "./order.module.css";
import { useParams } from "react-router-dom";
import { operatorStore } from "../../store/operatorStore";
import { API_URL } from "../../http";
import { Button, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
	formReducer,
	setPriceEditModeAC,
	setPriceValueAC,
	setStatusEditModeAC,
	setStatusValueAC,
} from "./fromReducer";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Chat, StatusType } from "../../models/response/OperatorResponse";
import { Context } from "../..";
import io, { Socket } from "socket.io-client";
import SendIcon from "@mui/icons-material/Send";
export const FullOrder = observer(() => {
	const params = useParams();
	const orderId = Number(params.id);
	const { store } = useContext(Context);
	const order = operatorStore.orders.find((order) => {
		return order.id === orderId;
	});
	const [message, setMessage] = React.useState("");

	const [form, dispatchForm] = React.useReducer(formReducer, {
		editMode: {
			status: false,
			price: false,
		},
		form: {
			price: {
				value: "" + order?.price,
			},
			status: {
				value: "" + order?.status,
			},
		},
	});

	const choise = (status: StatusType) => {
		switch (status) {
			case "job":
				return "В работе";
			case "pending":
				return "Ожидает принятия";
			case "rejected":
				return "Отклонен";
			case "resolved":
				return "Выполнен";
		}
	};

	const onSetStatus = (event: SelectChangeEvent) => {
		dispatchForm(setStatusValueAC(event.target.value as string));
		if (operatorStore.socket) {
			operatorStore.socket.emit("set_status", {
				orderId: orderId,
				status: event.target.value,
			});

			operatorStore.socket.emit("start_counter", {
				orderId: orderId,
				countvalue: order?.operatorSettings.fulfillmentTime,
				status: event.target.value,
			});

			operatorStore.socket.emit("send_message", {
				orderId,
				message: `оператор изменил статус заявки на "${choise(
					event.target.value as StatusType
				)}"`,
				type: "action",
				senderRole: store.user.role,
			});
		}
	};

	const onChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
		dispatchForm(setPriceValueAC(event.currentTarget.value));
	};

	const onSend = () => {
		if (operatorStore.socket) {
			operatorStore.socket.emit("send_message", {
				orderId,
				message,
				type: "message",
				senderRole: store.user.role,
			});
		}
		setMessage("");
	};

	return (
		<div className={classes.root}>
			<div className={classes.order}>
				<div className={classes.orderImgContainer}>
					<img src={`${API_URL}/uploads/${order?.imgName}`} alt="" />
				</div>

				<div className={classes.priceContainer}>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<div className={classes.header}>Стоимость изделия</div>
						{store.user.role === "operator" && (
							<div>
								<Button
									style={{ marginRight: "5px" }}
									onClick={() => {
										dispatchForm(setPriceEditModeAC(false));
										if (operatorStore.socket) {
											operatorStore.socket.emit("set_price", {
												orderId: orderId,
												price: form.form.price.value,
											});
										}

										if (operatorStore.socket) {
											operatorStore.socket.emit("send_message", {
												orderId,
												message: `оператор изменил стоимость на ${form.form.price.value}р`,
												type: "action",
												senderRole: store.user.role,
											});
										}
									}}
									variant={!form.editMode.price ? "contained" : "text"}
								>
									<RemoveRedEyeIcon />
								</Button>
								<Button
									onClick={() => {
										dispatchForm(setPriceEditModeAC(true));
									}}
									variant={form.editMode.price ? "contained" : "text"}
								>
									<EditIcon />
								</Button>
							</div>
						)}
					</div>

					{form.editMode.price ? (
						<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
							<input
								type="text"
								value={form.form.price.value}
								onChange={onChangePrice}
								className={classes.input}
							/>
							<span>₽</span>
						</div>
					) : (
						<span>{order?.price} ₽</span>
					)}
				</div>
				<div className={classes.statusContainer}>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<div className={classes.header}>Статус заказа</div>
						{store.user.role === "operator" && (
							<div>
								<Button
									onClick={() => dispatchForm(setStatusEditModeAC(false))}
									style={{ marginRight: "5px" }}
									variant={!form.editMode.status ? "contained" : "text"}
								>
									<RemoveRedEyeIcon />
								</Button>
								<Button
									onClick={() => dispatchForm(setStatusEditModeAC(true))}
									variant={form.editMode.status ? "contained" : "text"}
								>
									<EditIcon />
								</Button>
							</div>
						)}
					</div>
					{form.editMode.status ? (
						<div>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={form.form.status.value}
								style={{ width: "80%", marginTop: "5px" }}
								onChange={onSetStatus}
							>
								<MenuItem
									disabled={
										order?.status === "job" ||
										order?.status === "rejected" ||
										order?.status === "resolved"
									}
									value={"pending"}
								>
									Ожидает принятия
								</MenuItem>
								<MenuItem
									disabled={order?.status === "rejected" || order?.status === "resolved"}
									value={"job"}
								>
									В работе
								</MenuItem>
								<MenuItem value={"resolved"}>Выполнен</MenuItem>
								<MenuItem
									disabled={order?.status === "job" || order?.status === "resolved"}
									value={"rejected"}
								>
									Отклонен
								</MenuItem>
							</Select>
						</div>
					) : (
						<span>{order?.message}</span>
					)}
				</div>
				<div className={classes.descriptionContainer}>
					<div className={classes.header}>Описание</div>
					<span>{order?.description}</span>
				</div>
				<div className={classes.fileContainer}>
					<div className={classes.header} style={{ marginRight: "20px" }}>
						Скачать файл
					</div>
					<Button>Скачать</Button>
					{order?.status === "job" && (
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								width: "60%",
								alignItems: "center",
								gap: "10px",
							}}
						>
							{store.user.role === "operator" && (
								<>
									<div style={{ fontSize: "20px", fontWeight: 200 }}>
										Осталось времени для выполнения
									</div>
									<div style={{ fontSize: "25px" }}>
										{order.operatorSettings.fulfillmentTime.split(" ")[0]}:
										{order.operatorSettings.fulfillmentTime.split(" ")[1]}:
										{order.operatorSettings.fulfillmentTime.split(" ")[2]}
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</div>
			<div className={classes.user}>
				{store.user.role !== "user" ? (
					<div className={classes.personal}>
						<div className={classes.userImgContainer}>
							<img src={`${API_URL}/uploads/${order?.customer.avatar}`} alt="" />
						</div>
						<div className={classes.userInitialsContainer}>
							<div className={classes.email}>email - {order?.customer.email}</div>
							<div className={classes.initials}>
								{order?.customer.surname} {order?.customer.name}{" "}
								{order?.customer.patronymic}
							</div>
							<div className={classes.phoneNumber}>
								Номер телефона - {order?.customer.phoneNumber}
							</div>
						</div>
					</div>
				) : (
					<div className={classes.personal}>
						<div className={classes.userImgContainer}>
							<img src={`${API_URL}/uploads/${order?.operator.avatar}`} alt="" />
						</div>
						<div className={classes.userInitialsContainer}>
							<div className={classes.email}>email - {order?.operator.email}</div>
							<div className={classes.initials}>
								{order?.operator.surname} {order?.operator.name}{" "}
								{order?.operator.patronymic}
							</div>
							<div className={classes.phoneNumber}>
								Номер телефона - {order?.operator.phoneNumber}
							</div>
						</div>
					</div>
				)}

				<div className={classes.chatHeader}>
					{store.user.role === "operator" ? "Чат с заказчиком" : "Чат с оператором"}
				</div>

				<div className={classes.chatBlock}>
					{order?.chat
						.slice()
						.reverse()
						.map((message) => {
							if (message.type === "action") {
								return (
									<div key={message.id} className={classes.chatItemAlert}>
										{message.text}
									</div>
								);
							}
							return message.senderRole === "user" ? (
								<div key={message.id} className={classes.chatItemUser}>
									<div>{message.time}</div>
									<div>{message.text}</div>
								</div>
							) : (
								<div key={message.id} className={classes.chatItemOperator}>
									<div>{message.text}</div>
									<div>{message.time}</div>
								</div>
							);
						})}
				</div>

				<div style={{ position: "relative" }}>
					<input
						type="text"
						value={message}
						placeholder={
							store.user.role === "operator"
								? "Ответьте на вопрос заказчика"
								: "Задайте вопрос по заказу"
						}
						onChange={(e) => setMessage(e.currentTarget.value)}
						className={classes.chatInput}
					/>
					<Button
						onClick={onSend}
						style={{ position: "absolute", right: 0, transform: "translateY(2px)" }}
					>
						<SendIcon />
					</Button>
				</div>
			</div>
		</div>
	);
});
