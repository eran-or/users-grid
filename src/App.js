import React from 'react';
import './App.css';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Header from './modules/header/Header'
import Users from './modules/user/Users'

function App() {
  return (
    <>
    <Router basename="/medigate">
      <Header />
      <Switch>
        <Route exact path="/logout">
          {/* <Logout /> */}
          <div>Logout</div>
        </Route>
        <Route exact path="/alerts">
          {/* <Alerts /> */}
          <div>Alerts</div>
        </Route>
        <Route exact path="/users">
          <Users />
        </Route>
        <Route path="/">
          {/* <Home /> */}
        </Route>
      </Switch>
    </Router>
    </>
  );
}

export default App;
