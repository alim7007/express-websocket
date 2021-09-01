import React, {createContext, useState} from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import { ContextProvider } from './socketContext/Context';
import './styles.css'

function App() {
  return (
    <>
    <BrowserRouter>
      <Switch>
        <ContextProvider>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/room/:roomID" exact component={Room} />
        </ContextProvider>
      </Switch>
    </BrowserRouter>
    </>
  );
}

export default App;
