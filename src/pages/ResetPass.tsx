import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { AuthService } from "../services/AuthService";
import SimpleMDE from "react-simplemde-editor";
export const ResetPass = () => {
	const param = useParams();
	const navigate = useNavigate();
	const [first, setFirst] = React.useState("");
	const [second, setSecond] = React.useState("");

	const onSubmit = async () => {
		console.log(param);
		if (first === second) {
			try {
				if (param.link) {
					await AuthService.resetPass(second, param.link);
					navigate("/");
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Сброс пароля
					</Typography>
					<Typography>Введите новый пароль</Typography>
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
						label="введите пароль"
						value={first}
						onChange={(e) => setFirst(e.currentTarget.value)}
					/>
					<TextField
						type="text"
						label="повторите пароль"
						value={second}
						onChange={(e) => setSecond(e.currentTarget.value)}
					/>
				</div>
				<div style={{ marginTop: 10 }}>
					<Button onClick={onSubmit}>сохранить</Button>
				</div>
			</Paper>
		</div>
	);
};
