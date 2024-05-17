import React, { ChangeEvent, useContext } from "react";
import { Order } from "../models/IOrder";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardActions } from "@mui/material";
import { API_URL } from "../http";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Context } from "..";
import { orderStore } from "../store/orderStore";
type PropsType = {
	order: Order;
	handleDownload: (id: number) => void;
	editble?: boolean;
	handleGet?: (status: string, price: string, id: number) => void;
};
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",

	boxShadow: 24,
	p: 4,
};
export const OrderComponent: React.FC<PropsType> = (props) => {
	const [status, setStatus] = React.useState(props.order.status);
	const [price, setPrice] = React.useState(props.order.price);
	const [open, setOpen] = React.useState(false);
	const [descr, setDescr] = React.useState("");
	const { store } = useContext(Context);
	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};
	const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
		setPrice(e.currentTarget.value);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const clickHandler = () => {
		if (props.handleGet) props.handleGet(status, price, props.order.id);
	};
	console.log(props.order);
	return (
		<>
			<Card sx={{ width: 300, height: props.editble ? "450px" : "350px" }}>
				<CardActionArea
					onClick={(e) => {
						if (store.user.role === "user") {
							handleOpen();
						}
					}}
				>
					<CardMedia
						component="img"
						height="140"
						image={`${API_URL}/uploads/${props.order.imgName}`}
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							{props.order.name}
						</Typography>
						<Typography
							style={{ wordBreak: "break-all" }}
							variant="body2"
							color="text.secondary"
						>
							{props.order.description}
							<br />
							цена -{" "}
							{props.editble ? (
								<TextField
									type="number"
									id="standard-basic"
									value={price}
									onChange={handleChangeText}
									variant="standard"
								/>
							) : (
								props.order.price
							)}
							р
							<br />
							статус -{" "}
							{props.editble ? (
								<FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
									<Select
										labelId="demo-simple-select-standard-label"
										id="demo-simple-select-standard"
										value={status}
										label="Статус"
										onChange={handleChange}
									>
										<MenuItem value={"pending"}>ожидает принятия</MenuItem>
										<MenuItem value={"job"}>в работе</MenuItem>
										<MenuItem value={"resolved"}>готово к выдаче</MenuItem>
										<MenuItem value={"rejected"}>отклонено</MenuItem>
									</Select>
								</FormControl>
							) : (
								props.order.message
							)}
							<br />
							файл -
							<Button onClick={() => props.handleDownload(props.order.id)}>Скачать</Button>
							<div>{props.editble && <Button onClick={clickHandler}>Сохранить</Button>}</div>
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Редактировать описание
					</Typography>
					<TextField
						value={descr}
						onChange={(e) => {
							setDescr(e.currentTarget.value);
						}}
						style={{ width: "100%" }}
					/>
					<Button
						onClick={async () => {
							await orderStore.fetchUpdateDescr(props.order.id, descr);
							handleClose();
						}}
					>
						Сохранить
					</Button>
				</Box>
			</Modal>
		</>
	);
};
