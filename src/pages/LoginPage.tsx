import React, { useContext } from "react";
import { Context } from "..";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { AuthService } from "../services/AuthService";
import { useSnackbar, VariantType } from "notistack";
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	height: 250,
	boxShadow: 24,
	p: 4,
	borderRadius: "6px",
};

export const LoginPage = () => {
	const { store } = useContext(Context);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const [next, setNext] = React.useState(false);
	const [recuperation, setRecuperation] = React.useState("");
	const { enqueueSnackbar } = useSnackbar();
	const setSnackBartoQueue = (variant: VariantType, message: string) => () => {
		enqueueSnackbar(message, { variant });
	};
	const navigate = useNavigate();

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleNextOpen = () => setNext(true);
	const handleNextClose = () => setNext(false);
	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Авторизация
					</Typography>
					<Typography>
						Для начала работы, пожалуйста, авторизуйтесь либо зарегестрируйтесь
					</Typography>
				</Toolbar>
			</AppBar>
			<Paper
				style={{
					width: "500px",
					height: "350px",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					margin: "0 auto",
					marginTop: "100px",
				}}
			>
				<div style={{ display: "flex", gap: 6 }}>
					<TextField
						type="text"
						label="email"
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
					<TextField
						type="text"
						label="пароль"
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
				</div>
				<div>
					<Button
						onClick={async () => {
							const result = await store.registration(email, password);
							if (result.status) {
								navigate("/office");
								return;
							}
							setSnackBartoQueue("error", result.message)();
						}}
					>
						зарегестрироваться
					</Button>
					/
					<Button
						onClick={async () => {
							const result = await store.login(email, password);
							if (result.status) {
								navigate("/office");
								return;
							}
							setSnackBartoQueue("error", result.message)();
						}}
					>
						авторизоваться
					</Button>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Typography>Не удается войти? Воспользуйтесь функцией</Typography>

					<Button onClick={handleOpen}>Восстановления пароля</Button>
				</div>
			</Paper>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Восстановление пароля
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						пожалуйста, введите адрес своей электронной почты
					</Typography>
					<TextField
						value={recuperation}
						onChange={(e) => setRecuperation(e.currentTarget.value)}
						id="standard-basic"
						label="email"
						variant="standard"
					/>
					<Button
						onClick={async () => {
							if (recuperation.trim()) {
								try {
									handleClose();
									await AuthService.sendResetMail(recuperation);
									handleNextOpen();
									setRecuperation("");
								} catch (err) {
									console.log(err);
								}
							}
						}}
						variant="outlined"
						style={{ position: "absolute", right: 10, bottom: 10 }}
					>
						Далее
					</Button>
				</Box>
			</Modal>

			<Modal
				open={next}
				onClose={handleNextClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Восстановление пароля
					</Typography>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						пожалуйста, перейдите на почту, которую вы указали на предыдущем шаге, туда было
						отправленно сообщение с инструкцией по восстановленю пароля
					</Typography>
				</Box>
			</Modal>
		</div>
	);
};
