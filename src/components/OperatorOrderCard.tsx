import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { CardActionArea } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { API_URL } from "../http";
import { GetOrders } from "../models/response/OperatorResponse";
import { useNavigate } from "react-router-dom";

type PropsType = {
	order: GetOrders;
};

export const OperatorOrderCard: React.FC<PropsType> = React.memo(({ order }) => {
	const navigate = useNavigate();

	const onNavigate = () => {
		navigate(`/order/${order.id}`);
	};

	return (
		<Card sx={{ maxWidth: 345 }} style={{ width: "250px" }}>
			<CardActionArea onClick={onNavigate}>
				<CardHeader
					avatar={
						<Avatar
							sx={{
								bgcolor: `#${Math.floor(Math.random() * 0xffffff)
									.toString(16)
									.padEnd(6, "0")}`,
							}}
							aria-label="recipe"
						>
							{order.customer.surname ? order.customer.surname[0].toUpperCase() : "U"}
						</Avatar>
					}
					title={`${order.customer.surname} ${order.customer.name[0]}.${order.customer.patronymic[0]}`}
				/>
				<CardMedia
					component="img"
					height="194"
					image={`${API_URL}/uploads/${order.imgName}`}
					alt="Paella dish"
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{order.description.length > 25
							? order.description.slice(0, 26) + "..."
							: order.description}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
});
