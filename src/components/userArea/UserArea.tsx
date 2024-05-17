import React from "react";
import classes from "./userArea.module.css";
import { GetAllOrdersResponse } from "../../models/response/GetAllOrdersResponse";
import defaultAvatar from "../../static/defaultAvatar.jpg";
import { observer } from "mobx-react-lite";
import { API_URL } from "../../http";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { orderAdminStore } from "../../store/orderAdminStore";
import { OrderComponent } from "../Order";
import userImg from "../../static/unauthtorizeImg.png";
import nothinkImg from "../../static/nothinkAdmin.png";
import { typeStore } from "../../store/typeStore";
import { formItemStyle } from "../createOrderForm/CreateOrderForm";
type Props = {
	currentUser: GetAllOrdersResponse | undefined;
	handleDownload: (id: number) => void;
	handleGet: (status: string, price: string, id: number) => void;
};

export const UserArea: React.FC<Props> = observer(({ currentUser, handleDownload, handleGet }) => {
	const [filter, setFilter] = React.useState("all");
	const [statusFilter, setStatusFilter] = React.useState("all");
	const [serarchString, setSearchString] = React.useState("");
	const handleValid = () => {
		if (currentUser && currentUser.personal) {
			const { name, surname, patronymic, phoneNumber } = currentUser.personal;

			if (!name || !surname || !patronymic || !phoneNumber) {
				return true;
			}
		}
	};
	const handleChange = (event: SelectChangeEvent) => {
		setFilter(event.target.value as string);
	};

	const handleChangeStatus = (event: SelectChangeEvent) => {
		setStatusFilter(event.target.value as string);
	};

	let filteredOrders = currentUser?.order;
	if (filter !== "all" && filteredOrders)
		filteredOrders = filteredOrders.filter((order) => {
			return filter === order.type;
		});

	if (statusFilter !== "all" && filteredOrders)
		filteredOrders = filteredOrders.filter((order) => {
			return order.status === statusFilter;
		});

	if (filteredOrders)
		filteredOrders = filteredOrders.filter((order) => {
			const exp = order.description.toLowerCase().includes(serarchString.toLowerCase());
			return exp;
		});

	return (
		<>
			{!currentUser ? (
				<div className={classes.imgBlock}>
					<Typography style={{ fontWeight: 100 }} variant="h4">
						нет активных пользователей
					</Typography>
					<img src={userImg} alt="" />
				</div>
			) : (
				currentUser && (
					<div className={classes.personal}>
						<div className={classes.personalLeft}>
							<img
								src={
									currentUser.personal.avatar
										? `${API_URL}/uploads/${currentUser.personal.avatar}`
										: defaultAvatar
								}
								alt="avatar"
							/>
						</div>
						<div className={classes.personalRight}>
							{!handleValid() ? (
								<>
									<Typography>
										Фамилия{" "}
										<span style={{ fontWeight: 900 }}>
											{currentUser.personal.surname}
										</span>
									</Typography>
									<Typography>
										Имя{" "}
										<span style={{ fontWeight: 900 }}>{currentUser.personal.name}</span>
									</Typography>
									<Typography>
										Отчество{" "}
										<span style={{ fontWeight: 900 }}>
											{currentUser.personal.patronymic}
										</span>
									</Typography>
									<Typography>
										Номер телефона{" "}
										<span style={{ fontWeight: 900 }}>
											{currentUser.personal.phoneNumber}
										</span>
									</Typography>
								</>
							) : (
								<Typography>пользователь не заполнил личные данные</Typography>
							)}
							<div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
								<Button
									onClick={() =>
										orderAdminStore.fetchToSelectRole("admin", currentUser.id)
									}
									variant={currentUser.role === "admin" ? "contained" : "outlined"}
								>
									Администратор
								</Button>
								<Button
									onClick={() =>
										orderAdminStore.fetchToSelectRole("accounting", currentUser.id)
									}
									variant={currentUser.role === "accounting" ? "contained" : "outlined"}
								>
									Бухгалтер
								</Button>
								<Button
									onClick={() => orderAdminStore.fetchToSelectRole("user", currentUser.id)}
									variant={currentUser.role === "user" ? "contained" : "outlined"}
								>
									Пользователь
								</Button>
								<Button
									onClick={() =>
										orderAdminStore.fetchToSelectRole("operator", currentUser.id)
									}
									variant={currentUser.role === "operator" ? "contained" : "outlined"}
								>
									Оператор
								</Button>
							</div>
						</div>
					</div>
				)
			)}
			<div>
				{currentUser && (currentUser.role === "accounting" || currentUser.role === "admin") ? (
					<Typography variant="h4" style={{ fontWeight: 100 }}>
						Роль этого пользователя не подразумевает наличия заявок
					</Typography>
				) : (
					<>
						<div style={{ marginBottom: 10, paddingLeft: 10 }}>
							<FormControl>
								<InputLabel id="demo-simple-select-helper-label">Фильтр по типу</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={filter}
									onChange={handleChange}
									style={{ ...formItemStyle, marginTop: 10 }}
								>
									<MenuItem key={123723981} value={"all"}>
										Все
									</MenuItem>
									{typeStore.types.map((el) => {
										return (
											<MenuItem key={el.id} value={el.type}>
												{el.name}
											</MenuItem>
										);
									})}
								</Select>
							</FormControl>
							<TextField
								style={{ ...formItemStyle, marginTop: 10, marginLeft: 10 }}
								label="поиск по описанию"
								value={serarchString}
								onChange={(e) => setSearchString(e.currentTarget.value)}
							/>

							<FormControl>
								<InputLabel id="demo-simple-select-helper-label">
									Фильтр по статусу
								</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={statusFilter}
									onChange={handleChangeStatus}
									style={{ ...formItemStyle, marginTop: 10, marginLeft: 10 }}
								>
									<MenuItem key={123723981} value={"all"}>
										Все
									</MenuItem>
									<MenuItem key={123723981} value={"pending"}>
										ожидает принятия
									</MenuItem>
									<MenuItem key={123723981} value={"job"}>
										в работе
									</MenuItem>
									<MenuItem key={123723981} value={"resolved"}>
										готово к выдаче
									</MenuItem>
									<MenuItem key={123723981} value={"rejected"}>
										отклонено
									</MenuItem>
								</Select>
							</FormControl>
						</div>
						<div className={classes.wrap}>
							{currentUser && currentUser.order.length && filteredOrders ? (
								filteredOrders.length ? (
									filteredOrders.map((order) => {
										return order.type ? (
											<OrderComponent
												editble
												key={order.id}
												order={order}
												handleDownload={handleDownload}
												handleGet={handleGet}
											/>
										) : (
											<div key={order.id}>не поддерживаемый тип</div>
										);
									})
								) : (
									<div className={classes.imgBlock}>
										<Typography style={{ fontWeight: 100 }} variant="h4">
											заявки не найдены
										</Typography>
										<img src={nothinkImg} alt="" />
									</div>
								)
							) : (
								currentUser && (
									<div className={classes.imgBlock}>
										<Typography style={{ fontWeight: 100 }} variant="h4">
											заявок от этого пользователя пока нет
										</Typography>
										<img src={nothinkImg} alt="" />
									</div>
								)
							)}
						</div>
					</>
				)}
			</div>
		</>
	);
});
