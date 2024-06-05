import { Container, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../..";
import classes from "./office.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import defaultAvatar from "../../static/defaultAvatar.jpg";
import EditIcon from "@mui/icons-material/Edit";
import { MuiTelInput } from "mui-tel-input";
import { API_URL } from "../../http";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import { useSnackbar, VariantType } from "notistack";

type ObjValidType = {
	phone: string;
	name: string;
	surname: string;
	patronymic: string;
	file: any;
};

export const Office = observer(() => {
	const { store } = useContext(Context);
	const inputFileRef = React.useRef<null | HTMLInputElement>(null);

	const { enqueueSnackbar } = useSnackbar();
	const [phone, setPhone] = React.useState(store.personal.phoneNumber);
	const [name, setName] = React.useState<string>(store.personal.name);
	const [surname, setSurname] = React.useState<string>(store.personal.surname);
	const [patronymic, setPatronymic] = React.useState<string>(store.personal.patronymic);
	const [file, setFile] = React.useState<any>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	React.useEffect(() => {
		// setName(store.personal.name);
		// setSurname(store.personal.surname);
		// setPatronymic(store.personal.patronymic);
		// setPhone(store.personal.phoneNumber);
		// setIsLoading(false);
	}, []);

	const setSnackBartoQueue = (variant: VariantType, message: string) => () => {
		enqueueSnackbar(message, { variant });
	};
	const handleChangePhone = (newValue: string) => {
		setPhone(newValue);
	};

	const handleValid = (obj: ObjValidType) => {
		if (!obj.name) {
			return {
				status: true,
				message: "имя не может быть пустым",
			};
		}

		if (!obj.surname) {
			return {
				status: true,
				message: "поле с фамилией не можеть быть пустой",
			};
		}
		//@ts-ignore
		if (!obj.phone.length > 16) {
			return {
				status: true,
				message: "не корректный ввод номера телефона",
			};
		}

		return false;
	};

	const onSubmit = async () => {
		const valid = handleValid({
			name,
			surname,
			patronymic,
			phone,
			file,
		});

		if (!valid) {
			try {
				await store.editSurname(store.user.id, surname);
				await store.editPatronymic(store.user.id, patronymic);
				await store.editName(store.user.id, name);
				await store.editPhoneNumber(store.user.id, phone);
				setSnackBartoQueue("success", "данные успешно изменены")();
			} catch (err) {}

			setFile(null);
		} else {
			setSnackBartoQueue("error", valid.message)();
		}
	};

	return (
		<Container>
			{isLoading ? (
				<div>загрузка</div>
			) : (
				<div className={classes.wrapper}>
					<div className={classes.left}>
						<div className={classes.avatarWrapper}>
							<img
								src={
									!store.personal.avatar
										? defaultAvatar
										: `${API_URL}/uploads/${store.personal.avatar}`
								}
								alt=""
							/>
							<Typography style={{ textAlign: "center", marginBottom: 15 }}>
								{file && file.name ? file.name : null}
							</Typography>
							<input
								onChange={async (e) => {
									if (e.currentTarget.files) {
										// setFile(e.currentTarget.files[0]);
										const formData = new FormData();
										formData.append("userId", String(store.user.id));
										formData.append("file", e.currentTarget.files[0]);
										await store.editAvatar(formData);
										// setFile(null);
									}
								}}
								ref={inputFileRef}
								type="file"
								style={{ display: "none" }}
							/>
							<Button
								onClick={() => {
									if (inputFileRef && inputFileRef.current) {
										inputFileRef.current.click();
									}
								}}
								variant="outlined"
							>
								Изменить <EditIcon style={{ marginLeft: "10px" }} />
							</Button>
						</div>
					</div>
					<div className={classes.right}>
						<TextField
							value={surname}
							onChange={(e) => setSurname(e.currentTarget.value)}
							id="standard-basic"
							label="Фамилия"
							variant="standard"
						/>
						<TextField
							value={name}
							onChange={(e) => setName(e.currentTarget.value)}
							id="standard-basic"
							label="Имя"
							variant="standard"
						/>
						<TextField
							value={patronymic}
							onChange={(e) => setPatronymic(e.currentTarget.value)}
							id="standard-basic"
							label="Отчество"
							variant="standard"
						/>
						<MuiTelInput
							label="Номер телефона"
							style={{ marginTop: "20px" }}
							value={phone}
							onChange={handleChangePhone}
						/>
						<Typography style={{ marginTop: "10px" }}>
							тип аккаунта{" "}
							{store.user.isActivated ? (
								<span style={{ fontWeight: 900 }}>
									подтвержденный{" "}
									<CheckCircleIcon
										style={{ fill: "green", transform: "translateY(6px)" }}
									/>
								</span>
							) : (
								<span style={{ fontWeight: 900 }}>
									не подтвержденный{" "}
									<WarningIcon style={{ fill: "red", transform: "translateY(6px)" }} />
								</span>
							)}
						</Typography>
						<Button style={{ marginTop: "20px" }} onClick={onSubmit}>
							сохранить
						</Button>
					</div>
				</div>
			)}
		</Container>
	);
});
