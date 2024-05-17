import { observer } from "mobx-react-lite";
import React from "react";
import { accStore } from "../../store/accStore";
import classes from "./style.module.css";
import { GetAllAccResponse } from "../../models/response/AccResponse";
import { Button, Typography } from "@mui/material";
import { selected, unselected } from "../../components/orderAdmin/OrderAdmin";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useReactToPrint } from "react-to-print";
import noth from "../../static/noAccData.png";
export const AccountingPage = observer(() => {
	const [current, setCurrent] = React.useState<GetAllAccResponse>();
	const printRef = React.useRef<HTMLDivElement | null>(null);

	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});

	React.useEffect(() => {
		(async () => {
			try {
				await accStore.fetchReports();
				console.log(accStore.report);
				if (accStore.report[0]) {
					setCurrent(accStore.report[0]);
				}
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);

	const handleValid = (report: GetAllAccResponse) => {
		if (current && report) {
			if (current.id === report.id) return selected;
			else return unselected;
		}
	};

	return (
		<div className={classes.area}>
			{accStore.report.length ? (
				<>
					<div className={classes.left}>
						{accStore.report.map((report) => {
							return (
								<Typography
									style={handleValid(report)}
									key={report.id}
									onClick={() => setCurrent(report)}
								>
									отчет от {report.date}
								</Typography>
							);
						})}
					</div>
					{current && (
						<div className={classes.right}>
							<div>
								<div>
									общая выручка <strong>{current.revenue}</strong>р
								</div>
								<div>
									количество выполненных заказов <strong>{current.fullfiledQty}</strong>
								</div>
								<div>
									количество отклоненных заказов <strong>{current.rejectedQty}</strong>
								</div>
							</div>
							<Button onClick={handlePrint}>вывод на печать</Button>
							<div ref={printRef}>
								<TableContainer component={Paper}>
									<Table sx={{ minWidth: 650 }} aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell>Имя </TableCell>
												<TableCell align="right">Фамилия</TableCell>
												<TableCell align="right">Отчество&nbsp;</TableCell>
												<TableCell align="right">Номер телефона&nbsp;</TableCell>
												<TableCell align="right">Тип заявки&nbsp;</TableCell>
												<TableCell align="right">Цена&nbsp;</TableCell>
												<TableCell align="right">Эл.почта&nbsp;</TableCell>
												<TableCell align="right">Описание&nbsp;</TableCell>
												<TableCell align="right">статус&nbsp;</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{current &&
												current.report.map((report) => {
													return (
														<TableRow
															key={report.id}
															sx={{
																"&:last-child td, &:last-child th": { border: 0 },
															}}
														>
															<TableCell component="th" scope="row">
																{report.name}
															</TableCell>
															<TableCell align="right">{report.surname}</TableCell>
															<TableCell align="right">
																{report.patronymic}
															</TableCell>
															<TableCell align="right">
																{report.phoneNumber}
															</TableCell>
															<TableCell align="right">{report.orderType}</TableCell>
															<TableCell align="right">
																{report.orderPrice}р
															</TableCell>
															<TableCell align="right">{report.userEmail}</TableCell>
															<TableCell align="right">
																{report.orderDescription}
															</TableCell>
															<TableCell align="right">
																{report.status === "resolved"
																	? "выполнен"
																	: "отклонен"}
															</TableCell>
														</TableRow>
													);
												})}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</div>
					)}
				</>
			) : (
				<div className={classes.nothink}>
					<Typography variant="h2">Пока отчетов нет</Typography>
					<img src={noth} alt="" />
				</div>
			)}
		</div>
	);
});
