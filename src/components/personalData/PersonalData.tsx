import React from "react";
import classes from "./personalData.module.css";

type PropsType = {
	element: string;
	text: string;
};

export const PersonalData: React.FC<PropsType> = ({ element, text }) => {
	return (
		<div className={classes.wrap}>
			<div className={classes.element}>{element}</div>
			<div className={classes.text}>{text}</div>
		</div>
	);
};
