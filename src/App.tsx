import React, { useContext } from "react";
import { SnackbarProvider } from "notistack";
import { observer } from "mobx-react-lite";

import CustomRouter from "./routes/routes";
import { Context } from ".";
import { useNavigate } from "react-router-dom";
import { accStore } from "./store/accStore";
import { API_URL } from "./http";
import { io, Socket } from "socket.io-client";
import { operatorStore } from "./store/operatorStore";

function App() {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      (async () => {
        await store.checkAuth();
        await accStore.fetchOrg(1);

        navigate("/office");
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SnackbarProvider maxSnack={1} className="App">
      <CustomRouter isAuth={store.isAuth} />
    </SnackbarProvider>
  );
}

export default observer(App);
