import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { useSnackbar, VariantType } from "notistack";
import { observer } from "mobx-react-lite";
import { API_URL } from "../http";
import { IOrderType } from "../models/IOrderType";
import { typeStore } from "../store/typeStore";
import { useNavigate } from "react-router-dom";
type PropsType = {
	type: IOrderType;
	user?: boolean;
};

export const TypeCard: React.FC<PropsType> = observer(({ type, user }) => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const setSnackBartoQueue = (variant: VariantType, message: string) => () => {
		enqueueSnackbar(message, { variant });
	};

	const clickHandle = (id: number) => {
		if (!user) navigate(`/types/${id}`);
	};
	return (
		<Card key={type.id} sx={{ width: 300 }}>
			<CardActionArea onClick={() => clickHandle(type.id)}>
				<CardMedia component="img" height="140" image={`${API_URL}/uploads/${type.fileName}`} />
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{type.name}
					</Typography>
					<Typography
						style={{
							wordBreak: "break-all",
							textOverflow: "ellipsis",
							width: "100%",
							overflow: "hidden",
							whiteSpace: "nowrap",
						}}
						variant="body2"
						color="text.secondary"
					>
						{type.description}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Минимальная цена - {type.minPrice}р
					</Typography>
				</CardContent>
			</CardActionArea>
			{user ? null : (
				<CardActions>
					<Button
						onClick={async () => {
							const result = await typeStore.fetchToDelete(type.id);
							setSnackBartoQueue(result.variant, result.message)();
						}}
						size="small"
						color="primary"
					>
						удалить
					</Button>
				</CardActions>
			)}
		</Card>
	);
});
