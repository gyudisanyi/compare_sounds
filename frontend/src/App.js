import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Sets from './pages/Sets/Sets';
import Users from './pages/Users/Users';
import Home from './pages/Home/Home';

import './App.css';


export default function App() {

  return (
    <Router>
        <Switch>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/sets/:id">
            <Sets />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
  );
}