import React from "react";
import classes from "./operatorSettings.module.css";
import { observer } from "mobx-react-lite";
import { Settings, setTypeSettingsBody } from "../../models/response/GetAllOrdersResponse";
import { FormTime, setHoursAC, setMinutsAC, setSecondsAC, timeRducer } from "./timeReducer";
import {
	fromReducer,
	setDealPercentAC,
	setFineTardinessAC,
	setRetentionRejectionAC,
} from "./formSettingsReducer";
import { H2 } from "../h2/H2";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { orderAdminStore } from "../../store/orderAdminStore";
type PropsType = {
	settings: Settings | null;
	userId: number;
};

class PropsFromDto {
	dealPercent: string;
	fineTardiness: string;
	retentionRejection: string;

	constructor(object: Settings) {
		this.dealPercent = object.dealPercent.toString();
		this.fineTardiness = object.fineTardiness.toString();
		this.retentionRejection = object.retentionRejection.toString();
	}
}

export const OperatorSettings: React.FC<PropsType> = observer((props) => {
	console.log(props.settings);
	const [editMode, setEditMode] = React.useState(!props.settings);
	const propsTime = () => {
		if (props.settings) {
			const splitted = props.settings.fulfillmentTime.split(" ");
			return {
				hours: splitted[0],
				minuts: splitted[1],
				second: splitted[2],
			};
		}

		return {
			hours: "",
			minuts: "",
			second: "",
		};
	};

	const propsForm = () => {
		if (props.settings) return new PropsFromDto(props.settings);
		return {
			dealPercent: "",
			fineTardiness: "",
			retentionRejection: "",
		};
	};

	const switchEditMode = (bol: boolean) => {
		if (!bol) {
			onUpdate();
		}
		setEditMode(bol);
	};

	const [time, dispatchTime] = React.useReducer(timeRducer, propsTime() as FormTime);

	const [form, dispatchForm] = React.useReducer(fromReducer, propsForm());

	const onSave = async () => {
		const numForm = {
			dealPercent: Number(form.dealPercent),
			fineTardiness: Number(form.fineTardiness),
			retentionRejection: Number(form.retentionRejection),
		};

		const body: setTypeSettingsBody = {
			...numForm,
			fulfillmentTime: `${time.hours} ${time.minuts} ${time.second}`,
			userId: props.userId,
		};

		await orderAdminStore.fetchToSetSettings(body);
		setEditMode(false);
	};

	const onUpdate = async () => {
		const numForm = {
			dealPercent: Number(form.dealPercent),
			fineTardiness: Number(form.fineTardiness),
			retentionRejection: Number(form.retentionRejection),
		};

		const body: setTypeSettingsBody = {
			...numForm,
			fulfillmentTime: `${time.hours} ${time.minuts} ${time.second}`,
			userId: props.userId,
		};
		console.log(body);
		await orderAdminStore.fetchToUpdateSettings(body);
	};

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "10px",
				}}
			>
				<H2 type={props.settings ? "basic" : "dungerous"}>
					{props.settings ? "Конфигурация выставлена" : "Укажите необходимые настройки"}
				</H2>
				{props.settings ? (
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
				) : (
					<Button variant="contained" onClick={onSave}>
						<SaveIcon />
					</Button>
				)}
			</div>
			<div className={classes.settings}>
				<div className={classes.settingsItem}>
					<div className={classes.settingsText}>Время на выполнение</div>
					<div className={classes.control}>
						<div className={classes.settingsInputBlock}>
							{editMode ? (
								<input
									className={classes.inputControl}
									style={{ border: "2px solid #1976D2" }}
									type="text"
									value={time.hours}
									onChange={(e) => dispatchTime(setHoursAC(e.currentTarget.value))}
								/>
							) : (
								<div className={classes.inputControl}>{time.hours}</div>
							)}
							<div>часов</div>
						</div>
						<div className={classes.settingsInputBlock}>
							{editMode ? (
								<input
									className={classes.inputControl}
									style={{ border: "2px solid #1976D2" }}
									type="text"
									value={time.minuts}
									onChange={(e) => dispatchTime(setMinutsAC(e.currentTarget.value))}
								/>
							) : (
								<div className={classes.inputControl}>{time.minuts}</div>
							)}
							<div>минут</div>
						</div>
						<div className={classes.settingsInputBlock}>
							{editMode ? (
								<input
									className={classes.inputControl}
									type="text"
									style={{ border: "2px solid #1976D2" }}
									value={time.second}
									onChange={(e) => dispatchTime(setSecondsAC(e.currentTarget.value))}
								/>
							) : (
								<div className={classes.inputControl}>{time.second}</div>
							)}
							<div>секунд</div>
						</div>
					</div>
				</div>
			</div>

			<div className={classes.settings}>
				<div className={classes.settingsItem}>
					<div className={classes.settingsText}>Процент от сделки</div>
					<div className={classes.control}>
						<div className={classes.settingsInputBlock}>
							{editMode ? (
								<input
									type="text"
									className={classes.inputControl}
									onChange={(e) => dispatchForm(setDealPercentAC(e.currentTarget.value))}
									value={form.dealPercent}
									style={{ width: "100px", border: "2px solid #1976D2" }}
								/>
							) : (
								<div className={classes.inputControl}>{form.dealPercent}</div>
							)}
							<div>%</div>
						</div>
					</div>
				</div>
			</div>

			<div className={classes.settings}>
				<div className={classes.settingsItem}>
					<div className={classes.settingsText}>Штраф за опоздание</div>
					<div className={classes.control}>
						<div className={classes.settingsInputBlock}>
							{editMode ? (
								<input
									className={classes.inputControl}
									onChange={(e) => dispatchForm(setFineTardinessAC(e.currentTarget.value))}
									type="text"
									value={form.fineTardiness}
									style={{ width: "100px", border: "2px solid #1976D2" }}
								/>
							) : (
								<div className={classes.inputControl}>{form.fineTardiness}</div>
							)}
							<div>рублей</div>
						</div>
					</div>
				</div>
			</div>

			<div className={classes.settings}>
				<div className={classes.settingsItem}>
					<div className={classes.settingsText}>Удержание за отказ</div>
					<div className={classes.control}>
						<div className={classes.settingsInputBlock}>
							{editMode ? (
								<input
									className={classes.inputControl}
									type="text"
									value={form.retentionRejection}
									style={{ width: "100px", border: "2px solid #1976D2" }}
									onChange={(e) =>
										dispatchForm(setRetentionRejectionAC(e.currentTarget.value))
									}
								/>
							) : (
								<div className={classes.inputControl}>{form.retentionRejection}</div>
							)}
							<div>рублей</div>
						</div>
					</div>
				</div>
			</div>

			<div className={classes.settings}>
				<div className={classes.settingsItem}>
					<div className={classes.settingsText}>Заработано за все время</div>
					<div className={classes.control}>
						<div className={classes.settingsInputBlock}>
							<div className={classes.inputControl} style={{ width: "100px" }}>
								{props.settings ? props.settings.totalEarnings : null}
							</div>
							<div>рублей</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});
