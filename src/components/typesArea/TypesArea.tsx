import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { typeStore } from "../../store/typeStore";
import React from "react";

import classes from "./typesArea.module.css";
import nothinkImg from "../../static/nothinkTypes.png";

import { TypeCard } from "../TypeCard";
type AreaPropsType = {
	user?: boolean;
};

export const TypesArea: React.FC<AreaPropsType> = observer((props) => {
	React.useEffect(() => {
		typeStore.fetchTypes();
	}, []);

	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
			{typeStore.types.length ? (
				typeStore.types.map((el) => {
					return <TypeCard key={el.id} type={el} user={props.user} />;
				})
			) : (
				<div className={classes.imgBlock}>
					<Typography style={{ fontWeight: 100 }} variant="h4">
						Пока поддерживаемых услуг нет
					</Typography>
					<img src={nothinkImg} alt="" />
				</div>
			)}
		</div>
	);
});
