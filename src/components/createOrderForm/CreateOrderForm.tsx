import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { SetTypeSelect } from "../SetTypeSelect";
import Button from "@mui/material/Button";
import { typeStore } from "../../store/typeStore";
import { Context } from "../..";
import classes from "./orderForm.module.css";
import { orderStore } from "../../store/orderStore";
import { Typography } from "@mui/material";
import { useSnackbar, VariantType } from "notistack";

export const formItemStyle = {
	width: "210px",
	height: "56px",
	backgroundColor: "#fff",
};

type ValidObjType = {
	file: any;
	description: string;
	type: string;
};

export const CreateOrderForm = observer(() => {
	const { enqueueSnackbar } = useSnackbar();
	const [file, setFile] = React.useState<any>(null);
	const [description, setDescription] = React.useState("");
	const { store } = useContext(Context);
	const inputRef = React.useRef<null | HTMLInputElement>(null);
	const setSnackBartoQueue = (variant: VariantType, message: string) => () => {
		enqueueSnackbar(message, { variant });
	};
	const clear = () => {
		setDescription("");
		setFile(null);
		setDescription("");
	};
	const handleValid = (obj: ValidObjType) => {
		const { name, surname, patronymic, phoneNumber } = store.personal;

		if (!store.user.isActivated) {
			return {
				status: true,
				message: "перейдите на почту и подтвердите аккаунт",
			};
		}
		if (!obj.file) {
			return {
				status: true,
				message: "прикрепите файл",
			};
		}
		if (!obj.description) {
			return {
				status: true,
				message: "описание не может быть пустым",
			};
		}

		if (obj.type === "unqnown") {
			return {
				status: true,
				message: "выберете тип",
			};
		}

		if (!surname || !patronymic || !phoneNumber || !name) {
			return {
				status: true,
				message: "пожалуйста, перейдите в личный кабинет и заполните данные",
			};
		}

		return false;
	};

	const onSubmit = async () => {
		const valid = handleValid({
			file,
			description,
			type: typeStore.current.type,
		});

		if (!valid) {
			console.log(file, description, typeStore.current.type);
			const formData = new FormData();
			formData.append("file", file);
			formData.append("description", description);
			formData.append("type", typeStore.current.type);
			console.log(formData);

			const result = await orderStore.fetchAddOrder(store.user.id, formData);
			setSnackBartoQueue(result.variant, result.message)();
			if (result.variant === "success") {
				clear();
			}
		} else {
			setSnackBartoQueue("error", valid.message)();
		}
	};

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				style={{ display: "none" }}
				onChange={(e) => {
					if (e.currentTarget.files) setFile(e.currentTarget.files[0]);
				}}
			/>
			<div className={classes.container}>
				<div className={classes.wrapper}>
					<div>
						<Button
							style={formItemStyle}
							onClick={() => {
								if (inputRef) {
									inputRef.current?.click();
								}
							}}
						>
							Выберете файл
						</Button>
						<Typography
							style={{
								textOverflow: "ellipsis",
								width: "210px",
								overflow: "hidden",
								whiteSpace: "nowrap",
							}}
						>
							{file && file.name ? file.name : "не прикреплен"}
						</Typography>
					</div>

					<SetTypeSelect />

					<textarea
						onChange={(e) => {
							setDescription(e.currentTarget.value);
						}}
						value={description}
						className={classes.textArea}
						placeholder="Введите описание"
					/>
				</div>
				<Button style={{ ...formItemStyle, marginTop: 10 }} onClick={onSubmit}>
					заказать
				</Button>
			</div>
		</>
	);
});
