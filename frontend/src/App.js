import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Set from './pages/Set/Set';
import SetsPage from './pages/SetsPage/SetsPage';
import User from './pages/User/User';
import Home from './pages/Home/Home';
import Nav from "./components/Nav/Nav";

import './App.css';

export default function App() {

  return (
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
            <Route path="/:id">
              <User />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}