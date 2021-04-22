import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Set from './pages/Set/Set';
import SetsPage from './pages/SetsPage/SetsPage';
import UsersPage from './pages/UsersPage/UsersPage';
import User from './pages/User/User';
import Home from './pages/Home/Home';
import Nav from "./components/Nav/Nav";

import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#005555',
    },
    secondary: {
      main: '#ff5959',
    }
  },
});

export default function App() {

  return (
    <ThemeProvider theme={theme}>
      <div id = "main">
        <Nav/>
        <Router>
            <Switch>
              <Route exact path="/sets/:id">
                <Set />
              </Route>
              <Route exact path="/sets">
                <SetsPage />
              </Route>
              <Route exact path="/users">
                <UsersPage />
              </Route>
              <Route path="/:id">
                <User />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}