import React, { Component } from 'react';
import './App.css';

// Modules
import { Route } from 'react-router-dom';

// Component for Routes
import Admin from './component/Admin';
import Dashboard from './component/Dashboard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/admin" component={Admin} />
        <Route path="/dashboard" component={Dashboard} />
      </div>
    );
  }
}

export default App;
