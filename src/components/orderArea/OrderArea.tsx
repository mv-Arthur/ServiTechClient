import { observer } from "mobx-react-lite";
import React from "react";
import { orderStore } from "../../store/orderStore";
import { API_URL } from "../../http";
import { OrderComponent } from "../Order";
import nothinkImg from "../../static/nothinkClient.png";
import classes from "./orderArea.module.css";
import { TextField, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { typeStore } from "../../store/typeStore";
import { formItemStyle } from "../createOrderForm/CreateOrderForm";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { operatorStore } from "../../store/operatorStore";

export const OrderArea = observer(() => {
  const [filter, setFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [serarchString, setSearchString] = React.useState("");
  const handleDownload = (id: number) => {
    window.location.href = `${API_URL}/user/download/${id}`;
  };
  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };
  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as string);
  };

  let filteredOrders = orderStore.orders;

  if (filter !== "all") {
    filteredOrders = orderStore.orders.filter((order) => {
      return filter === order.type;
    });
  }

  if (statusFilter !== "all" && filteredOrders)
    filteredOrders = filteredOrders.filter((order) => {
      return order.status === statusFilter;
    });

  filteredOrders = filteredOrders.filter((order) => {
    const exp = order.description
      .toLowerCase()
      .includes(serarchString.toLowerCase());
    return exp;
  });

  return (
    <>
      <FormControl style={{ marginTop: "15px" }}>
        <InputLabel id="demo-simple-select-helper-label">
          Фильтр по типу
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filter}
          onChange={handleChange}
          style={{ ...formItemStyle, marginTop: 10 }}
        >
          <MenuItem key={123723981} value={"all"}>
            Все
          </MenuItem>
          {typeStore.types.map((el) => {
            return (
              <MenuItem key={el.id} value={el.type}>
                {el.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <TextField
        style={{ marginTop: 25, marginLeft: 10 }}
        label="поиск по описанию"
        value={serarchString}
        onChange={(e) => setSearchString(e.currentTarget.value)}
      />

      <FormControl style={{ marginTop: "15px" }}>
        <InputLabel id="demo-simple-select-helper-label">
          Фильтр по статусу
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={statusFilter}
          onChange={handleChangeStatus}
          style={{ ...formItemStyle, marginTop: 10, marginLeft: 10 }}
        >
          <MenuItem value={"all"}>Все</MenuItem>
          <MenuItem value={"pending"}>ожидает принятия</MenuItem>
          <MenuItem value={"job"}>в работе</MenuItem>
          <MenuItem value={"resolved"}>готово к выдаче</MenuItem>
          <MenuItem value={"rejected"}>отклонено</MenuItem>
        </Select>
      </FormControl>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 20,
          width: "100%",
          backgroundColor: "#F7F7F7",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        {filteredOrders.length ? (
          filteredOrders.map((order) => {
            return (
              <OrderComponent
                key={order.id}
                order={order}
                handleDownload={handleDownload}
              />
            );
          })
        ) : (
          <div className={classes.imgBlock}>
            <Typography style={{ fontWeight: 100 }} variant="h3">
              Пока заявок нет
            </Typography>
            <img src={nothinkImg} alt="" />
          </div>
        )}
      </div>
    </>
  );
});
