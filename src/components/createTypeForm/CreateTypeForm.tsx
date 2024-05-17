import React from "react";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { typeStore } from "../../store/typeStore";
import { v4 } from "uuid";
import classes from "./createTypeForm.module.css";
import { VariantType, useSnackbar } from "notistack";

type ValidType = {
	name: string;
	file: any;
	description: string;
	minPrice: string;
};

export const CreateTypeForm = observer(() => {
	const { enqueueSnackbar } = useSnackbar();
	const [name, setName] = React.useState<string>("");
	const [file, setFile] = React.useState<any>(null);
	const [description, setDescription] = React.useState<string>("");
	const [minPrice, setMinPrice] = React.useState("");
	const inputFileRef = React.useRef<HTMLInputElement>(null);

	const handleValid = (obj: ValidType) => {
		if (!obj.name) {
			return {
				status: true,
				message: "название не может быть пустым",
			};
		}

		if (!obj.description) {
			return {
				status: true,
				message: "описание не может быть пустым",
			};
		}

		if (!obj.file) {
			return {
				status: true,
				message: "загрузите файл",
			};
		}

		if (!obj.minPrice) {
			return {
				status: true,
				message: "цена не может быть пустой",
			};
		}

		return {
			status: false,
			message: "",
		};
	};

	const clear = () => {
		setName("");
		setFile(null);
		setDescription("");
		setMinPrice("");
	};
	const setSnackBartoQueue = (variant: VariantType, message: string) => () => {
		enqueueSnackbar(message, { variant });
	};

	const onSubmit = async () => {
		const validation = handleValid({
			name,
			file,
			description,
			minPrice,
		});

		if (!validation.status) {
			const formData = new FormData();
			const type = v4();
			formData.append("name", name);
			formData.append("type", type);
			formData.append("file", file);
			formData.append("description", description);
			formData.append("minPrice", minPrice);
			const result = await typeStore.addNewFetch(formData);
			setSnackBartoQueue(result.variant, result.message)();
			clear();
		} else {
			setSnackBartoQueue("error", validation.message)();
		}
	};
	console.log(file);
	return (
		<>
			<input
				onChange={(e) => {
					if (e.currentTarget.files) setFile(e.currentTarget.files[0]);
				}}
				type="file"
				ref={inputFileRef}
				style={{ display: "none" }}
			/>

			<div className={classes.container}>
				<div className={classes.wrap}>
					<div>
						<Button
							onClick={() => inputFileRef.current && inputFileRef.current.click()}
							variant="contained"
						>
							Прикрепить
						</Button>
						<Typography
							style={{
								textOverflow: "ellipsis",
								width: "127px",
								overflow: "hidden",
								whiteSpace: "nowrap",
								fontSize: "13px",
								fontWeight: 100,
							}}
						>
							{file && file.name ? file.name : "не прикреплен"}
						</Typography>
					</div>
					<TextField
						onChange={(e) => setName(e.currentTarget.value)}
						value={name}
						id="outlined-basic"
						label="введтие название типа"
						variant="outlined"
						style={{ backgroundColor: "#fff" }}
					/>

					<TextField
						onChange={(e) => setMinPrice(e.currentTarget.value)}
						value={minPrice}
						id="outlined-basic"
						label="минимальная цена"
						variant="outlined"
						type="number"
						style={{ backgroundColor: "#fff" }}
					/>
				</div>
				<div className={classes.areaWrap}>
					<textarea
						onChange={(e) => {
							setDescription(e.currentTarget.value);
						}}
						value={description}
						className={classes.textArea}
						placeholder="Введите описание"
					/>
					<Button
						style={{ height: 56, backgroundColor: "#fff", width: 210, marginTop: "10px" }}
						onClick={onSubmit}
						variant="outlined"
					>
						добавить
					</Button>
				</div>
			</div>
		</>
	);
});
