import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import { operatorStore } from "../../store/operatorStore";
import { Context } from "../..";
import { OperatorOrderCard } from "../../components/OperatorOrderCard";
import { Alert, Button, Container, Snackbar, TextField } from "@mui/material";
import classes from "./operator.module.css";
import { H2 } from "../../components/h2/H2";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { uniq } from "lodash";
import { roleForGetOrdersToOperator } from "../../services/OperatorService";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export type filterType = "pending" | "job" | "resolved" | "rejected" | "all";

export const OperatorPage = observer(() => {
  const { store } = useContext(Context);
  const [filter, setFilter] = React.useState<filterType>("all");
  const [serach, setSearch] = React.useState({
    description: "",
  });
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [userEmail, setUserEmail] = React.useState("all");

  const users = React.useMemo(() => {
    const customers = operatorStore.orders.map((order) => {
      return { ...order.customer };
    });
    const table: any = {};
    const res = customers.filter(
      ({ email }) => !table[email] && (table[email] = 1)
    );
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, operatorStore.orders]);

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as filterType);
  };

  React.useEffect(() => {
    operatorStore.fetchToSetOrders(
      store.user.id,
      store.user.role as roleForGetOrdersToOperator
    );
  }, [store.user.id]);

  let filteredOrders = operatorStore.orders;

  filteredOrders =
    filter === "all"
      ? operatorStore.orders
      : operatorStore.orders.filter((order) => {
          return order.status === filter;
        });

  filteredOrders = filteredOrders.filter((order) => {
    const exp = order.description
      .toLowerCase()
      .includes(serach.description.toLowerCase());
    return exp;
  });

  if (userEmail !== "all") {
    filteredOrders = filteredOrders.filter((order) => {
      return order.customer.email === userEmail;
    });
  }

  return (
    <>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Отправка отчета</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Все заявки с статусом "Отклонено" и "Готово к выдаче" будут
              удалены и отправлены в бухгалтерию, уверены что хотите продолжить?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                operatorStore.fetchToReport(store.user.id);
                handleClose();
              }}
            >
              Да
            </Button>
            <Button onClick={handleClose} autoFocus>
              Нет
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      <div className={classes.grid}>
        <div className={classes.control}>
          <div className={classes.controlItem}>
            <span>Поиск по описанию</span>
            <input
              type="text"
              onChange={(e) =>
                setSearch({ ...serach, description: e.currentTarget.value })
              }
            />
          </div>
          <div className={classes.controlItem}>
            <span>Поиск по имени пользователя</span>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value as string)}
            >
              <MenuItem value={"all"}>Все</MenuItem>
              {users.map((user) => {
                return (
                  <MenuItem value={user.email} key={user.email}>
                    {user.surname +
                      " " +
                      user.name[0] +
                      " " +
                      user.patronymic[0]}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
          <div className={classes.controlItem}>
            <span>Сортировка</span>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              onChange={handleChange}
            >
              <MenuItem value={"all"}>Все</MenuItem>
              <MenuItem value={"pending"}>Ожидают принятия</MenuItem>
              <MenuItem value={"job"}>В работе</MenuItem>
              <MenuItem value={"resolved"}>Выполненные</MenuItem>
              <MenuItem value={"rejected"}>Отклоненные</MenuItem>
            </Select>
          </div>
          <Button onClick={handleClickOpen}>Отправить отчет</Button>
        </div>
        <div className={classes.ordersArea}>
          {filteredOrders.length ? (
            filteredOrders.map((order) => {
              return <OperatorOrderCard key={order.id} order={order} />;
            })
          ) : (
            <div>нет активных заявок</div>
          )}
        </div>
      </div>
      {!!operatorStore.snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => operatorStore.setSnackBar(null)}
          autoHideDuration={6000}
        >
          <Alert
            {...operatorStore.snackbar}
            onClose={() => operatorStore.setSnackBar(null)}
          />
        </Snackbar>
      )}
    </>
  );
});
