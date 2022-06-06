import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Preferences from './components/Preferences/Preferences';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <div classname="wrapper">
        <h1>Application</h1>
        <BrowserRouter>
            <Switch>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/preferences">
                    <Preferences />
                </Route>
            </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
