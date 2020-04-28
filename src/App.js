import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import UsedCarPrices from './UsedCarPrices';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={UsedCarPrices} />
      </Switch>
    </Router>
  );
}

export default App;