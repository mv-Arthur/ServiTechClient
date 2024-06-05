import React, { ChangeEvent } from "react";
import { Order } from "../models/IOrder";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { API_URL } from "../http";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();
	const handleChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};
	const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
		setPrice(e.currentTarget.value);
	};

	const clickHandler = () => {
		if (props.handleGet) props.handleGet(status, price, props.order.id);
	};
	const onNavigate = () => {
		navigate(`/order/${props.order.id}`);
	};
	return (
		<>
			<Card sx={{ width: 300, height: props.editble ? "450px" : "350px" }}>
				<CardActionArea onClick={onNavigate}>
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
		</>
	);
};
