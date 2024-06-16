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
import { API_URL } from "../../http";
import defaultAvatar from "../../static/defaultAvatar.jpg";
export const AccountingPage = observer(() => {
  const printRef = React.useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = React.useState<null | number>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const right = accStore.report.find((report) => {
    return report.id === current;
  });

  React.useEffect(() => {
    (async () => {
      try {
        await accStore.fetchReports();
        console.log(accStore.report);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <>
      {accStore.report.length ? (
        <div className={classes.grid}>
          <div className={classes.left}>
            {accStore.report.map((report) => {
              return (
                <div
                  key={report.id}
                  className={classes.personalCard}
                  style={
                    current === report.id ? { backgroundColor: "#f1f1f1" } : {}
                  }
                  onClick={() => setCurrent(report.id)}
                >
                  <img
                    src={
                      report.operator.avatar
                        ? `${API_URL}/uploads/${report.operator.avatar}`
                        : defaultAvatar
                    }
                    alt=""
                  />
                  <div>
                    <div className={classes.initials}>
                      {!report.operator.name &&
                      !report.operator.surname &&
                      !report.operator.patronymic
                        ? "Не заполнил личные данные"
                        : `${report.operator.name} ${report.operator.surname}
                  ${report.operator.patronymic}`}
                    </div>
                    <div>
                      {report.operator.phoneNumber
                        ? report.operator.phoneNumber
                        : "номер телефона не указан"}
                    </div>
                    <div>{report.operator.email}</div>
                    <div>Отчет от {report.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={classes.right}>
            {right ? (
              <div>
                <TableContainer component={Paper}>
                  Итого к оплате {right.totalEarnings}р
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">описание</TableCell>
                        <TableCell align="center">цена</TableCell>
                        <TableCell align="center">статус</TableCell>

                        <TableCell align="center">имя типа</TableCell>
                        <TableCell align="center">фамилия</TableCell>
                        <TableCell align="center">имя</TableCell>
                        <TableCell align="center">отчество</TableCell>
                        <TableCell align="center">номер телефона</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {right.orders.map((row) => (
                        <TableRow key={row.order.id}>
                          <TableCell component="th" scope="row">
                            {row.order.description}
                          </TableCell>
                          <TableCell align="center">
                            {row.order.price}р
                          </TableCell>
                          <TableCell align="center">
                            {row.order.message}
                          </TableCell>
                          <TableCell align="center">{row.order.name}</TableCell>
                          <TableCell align="center">
                            {row.customer.surname}
                          </TableCell>
                          <TableCell align="center">
                            {row.customer.name}
                          </TableCell>
                          <TableCell align="center">
                            {row.customer.patronymic}
                          </TableCell>
                          <TableCell align="center">
                            {row.customer.phoneNumber}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              "Выберете элемент списка"
            )}
          </div>
        </div>
      ) : (
        <div className={classes.nothink}>
          <Typography variant="h2">Пока отчетов нет</Typography>
          <img src={noth} alt="" />
        </div>
      )}
    </>
  );
});
