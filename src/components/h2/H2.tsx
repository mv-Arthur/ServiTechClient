import React, { ReactNode } from "react";
import classes from "./h2.module.css";

type PropsType = {
	children: ReactNode;
	type: "basic" | "dungerous";
};

export const H2: React.FC<PropsType> = (props) => {
	let choised = classes.rightHeader;

	if (props.type === "dungerous") choised = classes.dungerous;

	return <div className={choised}>{props.children}</div>;
};
