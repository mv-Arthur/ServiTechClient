import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import { typeStore } from "../../store/typeStore";
import { API_URL } from "../../http";
import classes from "./fullType.module.css";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Button } from "@mui/material";
import { IOrderType } from "../../models/IOrderType";
import { orderAdminStore } from "../../store/orderAdminStore";
import tempAvatar from "../../static/defaultAvatar.jpg";

type FormValuesType = {
	name: string;
	minPrice: string;
	description: string;
};

class FormDto {
	name: string;
	minPrice: string;
	description: string;
	constructor(model: IOrderType) {
		this.name = model.name;
		this.minPrice = model.minPrice;
		this.description = model.description;
	}
}

type ChangeActionType = "name" | "minPrice" | "description";

export const FullType = observer(() => {
	const [editMode, setEditMode] = React.useState(false);
	const [formData, setFormData] = React.useState<FormValuesType>({} as FormValuesType);

	const params = useParams();

	const type = React.useMemo(() => {
		const id = Number(params.id);
		const founded = typeStore.types.find((type) => type.id === id);
		if (founded) setFormData(new FormDto(founded));
		return founded;
	}, [params.id]);

	const operators = React.useMemo(
		() => orderAdminStore.ordersForUsers.filter((user) => user.role === "operator"),
		[]
	);

	const switchEditMode = (bol: boolean) => setEditMode(bol);

	const changeAction = (type: ChangeActionType, value: string) => {
		switch (type) {
			case "description":
				setFormData((prev) => ({ ...prev, description: value }));
				break;
			case "minPrice":
				setFormData((prev) => ({ ...prev, minPrice: value }));
				break;
			case "name":
				setFormData((prev) => ({ ...prev, name: value }));
		}
	};
	console.log();
	return (
		<div className={classes.main}>
			<div className={classes.left}>
				{type ? (
					<div className={classes.block}>
						<div className={classes.btngroup}>
							<Button
								onClick={() => switchEditMode(false)}
								variant={!editMode ? "contained" : "text"}
							>
								<RemoveRedEyeIcon />
							</Button>
							<Button
								onClick={() => switchEditMode(true)}
								variant={editMode ? "contained" : "text"}
							>
								<EditIcon />
							</Button>
						</div>
						<div className={classes.imgBlock}>
							<img src={`${API_URL}/uploads/${type?.fileName}`} alt="type promo" />
						</div>
						<div className={classes.grid}>
							<div className={classes.promoItem + " " + classes.name}>
								<div>Наименование</div>
								<br />
								{editMode ? (
									<input
										onChange={(e) => changeAction("name", e.currentTarget.value)}
										value={formData.name}
										placeholder="введите новое наименование"
										className={classes.input}
										type="text"
									/>
								) : (
									<p>{type.name}</p>
								)}
							</div>
							<div className={classes.promoItem + " " + classes.minPrice}>
								<div>Минимальная цена</div>
								<br />
								{editMode ? (
									<input
										value={formData.minPrice}
										onChange={(e) => changeAction("minPrice", e.currentTarget.value)}
										placeholder="введите новую мин. цену"
										className={classes.input}
										type="text"
									/>
								) : (
									<p>{type.minPrice} рублей</p>
								)}
							</div>
							<div className={classes.promoItem + " " + classes.descr}>
								<div>Описание</div>
								<br />
								{editMode ? (
									<textarea
										value={formData.description}
										onChange={(e) => changeAction("description", e.currentTarget.value)}
										placeholder="введите новое описание"
										className={classes.textarea}
									/>
								) : (
									<p>{type.description}</p>
								)}
							</div>
						</div>
						<div></div>
					</div>
				) : (
					<div>не найдено</div>
				)}
			</div>
			<div className={classes.right}>
				{operators.length ? (
					operators.map((operator) => {
						return (
							<div key={operator.id} className={classes.operator}>
								<img
									src={operator.personal.avatar ? operator.personal.avatar : tempAvatar}
									alt="avatar"
								/>
								<div className={classes.textWrap}>
									<div className={classes.personal}>
										{!operator.personal.surname
											? "Нет личных данных"
											: `${operator.personal.surname} ${operator.personal.name} ${operator.personal.patronymic}`}
									</div>
									<div className={classes.phoneNumber}>
										{operator.personal.phoneNumber
											? operator.personal.phoneNumber
											: "Номер не указан"}
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div>нет активных операторов</div>
				)}
			</div>
		</div>
	);
});
