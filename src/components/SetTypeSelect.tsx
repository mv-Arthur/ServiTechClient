import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { observer } from "mobx-react-lite";
import { typeStore } from "../store/typeStore";
import { formItemStyle } from "./createOrderForm/CreateOrderForm";
export const SetTypeSelect = observer(() => {
	const [type, setType] = React.useState("unqnown");

	React.useEffect(() => {
		if (typeStore.current.id) setType(typeStore.current.type);
	}, []);

	const handleChange = (event: SelectChangeEvent) => {
		setType(event.target.value as string);
		typeStore.setCurrent(event.target.value);
	};
	console.log(typeStore.current.type);
	return (
		<>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={type}
				onChange={handleChange}
				style={formItemStyle}
			>
				<MenuItem key={123723981} value={"unqnown"}>
					выберете тип
				</MenuItem>
				{typeStore.types.map((el) => {
					return (
						<MenuItem key={el.id} value={el.type}>
							{el.name}
						</MenuItem>
					);
				})}
			</Select>
		</>
	);
});
