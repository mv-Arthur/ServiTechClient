import React from "react";
import { RoleType } from "../../models/RoleType";
import { Container, Typography } from "@mui/material";
import classes from "./organization.module.css";
import { observer } from "mobx-react-lite";
import { accStore } from "../../store/accStore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import defaultAvatar from "../../static/defaultAvatar.jpg";
import EditIcon from "@mui/icons-material/Edit";
import { MuiTelInput } from "mui-tel-input";
import { API_URL } from "../../http";
import { PersonalData } from "../../components/personalData/PersonalData";
import { useSnackbar, VariantType } from "notistack";
import { CookiesDelete } from "../../store/store";

type PropsType = {
	role: RoleType;
};

type ValidType = {
	phone: string;
	email: string;
	accNumber: string;
	description: string;
	address: string;
};

const handleValid = (obj: ValidType) => {
	if (!obj.accNumber) {
		return {
			status: true,
			message: "поле с номером счета не может быть пустым",
		};
	}
	if (!obj.phone) {
		return {
			status: true,
			message: "поле с номером телефона не может быть пустым",
		};
	}
	if (!obj.email) {
		return {
			status: true,
			message: "поле с электронной почтой не может быть пустым",
		};
	}
	if (!obj.description) {
		return {
			status: true,
			message: "поле с описанием не может быть пустым",
		};
	}
	if (!obj.address) {
		return {
			status: true,
			message: "поле с адресом не может быть пустым",
		};
	}

	return false;
};

export const Organization: React.FC<PropsType> = observer(({ role }) => {
	const inputFileRef = React.useRef<null | HTMLInputElement>(null);
	const [phone, setPhone] = React.useState<string>(accStore.org.phoneNumber);
	const [email, setEmail] = React.useState<string>(accStore.org.email);
	const [accNumber, setAccNumber] = React.useState<string>(accStore.org.accNumber);
	const [description, setDescription] = React.useState<string>(accStore.org.description);
	const [address, setAddress] = React.useState<string>(accStore.org.address);
	const { enqueueSnackbar } = useSnackbar();
	React.useEffect(() => {
		if (performance.navigation.type == 1) {
			CookiesDelete();
		}
		(async () => {
			await accStore.fetchOrg(1);
			setPhone(accStore.org.phoneNumber);
			setEmail(accStore.org.email);
			setAccNumber(accStore.org.accNumber);
			setDescription(accStore.org.description);
			setAddress(accStore.org.address);
		})();
	}, []);
	const handleChangePhone = (newValue: string) => {
		setPhone(newValue);
	};
	const setSnackBartoQueue = (variant: VariantType, message: string) => () => {
		enqueueSnackbar(message, { variant });
	};
	const onSubmit = async () => {
		const valid = handleValid({
			phone,
			email,
			accNumber,
			description,
			address,
		});

		if (!valid) {
			await accStore.edit({
				id: 1,
				email: email,
				phoneNumber: phone,
				accNumber: accNumber,
				address: address,
				description: description,
				avatar: accStore.org.avatar,
			});
			setSnackBartoQueue("success", "данные успешно изменены")();
		} else {
			setSnackBartoQueue("error", valid.message)();
		}
	};
	return (
		<Container>
			<div className={classes.wrapper}>
				<div className={classes.left}>
					<div className={classes.avatarWrapper}>
						<img
							src={
								!accStore.org.avatar
									? defaultAvatar
									: `${API_URL}/uploads/${accStore.org.avatar}`
							}
							alt=""
						/>

						{role === "accounting" && (
							<input
								onChange={async (e) => {
									if (e.currentTarget.files) {
										const fromData = new FormData();
										fromData.append("id", "1");
										fromData.append("file", e.currentTarget.files[0]);

										await accStore.editAvatar(fromData);
									}
								}}
								ref={inputFileRef}
								type="file"
								style={{ display: "none" }}
							/>
						)}
						{role === "accounting" && (
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
						)}
					</div>
				</div>
				<div className={classes.right}>
					{role === "accounting" ? (
						<TextField
							value={email}
							onChange={(e) => {
								setEmail(e.currentTarget.value);
							}}
							id="standard-basic"
							label="эл. почта"
							variant="standard"
						/>
					) : (
						<PersonalData element="ел. почта" text={email} />
					)}

					{role === "accounting" ? (
						<TextField
							value={address}
							onChange={(e) => setAddress(e.currentTarget.value)}
							id="standard-basic"
							label="адрес организации"
							variant="standard"
						/>
					) : (
						<PersonalData element="адрес организации" text={address} />
					)}

					{role === "accounting" ? (
						<TextField
							value={accNumber}
							onChange={(e) => setAccNumber(e.currentTarget.value)}
							id="standard-basic"
							label="номер счета"
							variant="standard"
						/>
					) : (
						<PersonalData element="номер счета" text={accNumber} />
					)}

					{role === "accounting" ? (
						<TextField
							value={description}
							onChange={(e) => setDescription(e.currentTarget.value)}
							id="standard-basic"
							label="описание"
							variant="standard"
						/>
					) : (
						<PersonalData element="описание" text={description} />
					)}

					{role === "accounting" ? (
						<MuiTelInput
							label="Номер телефона"
							style={{ marginTop: "20px" }}
							value={phone}
							onChange={handleChangePhone}
						/>
					) : (
						<PersonalData element="Номер телефона" text={phone} />
					)}

					{role === "accounting" && (
						<Button style={{ marginTop: "20px" }} onClick={onSubmit}>
							сохранить
						</Button>
					)}
				</div>
			</div>
		</Container>
	);
});
