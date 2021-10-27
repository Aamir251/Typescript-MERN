import React, { useContext } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import Profile from './pages/Profile';
import { Context, myContext } from './pages/Context';


function App() {

  const ctx = useContext(myContext);

  console.log(ctx);
  
  return (
    <Router>
        <Navbar />
          <Context>
            <Switch>
              <Route path="/" exact component={HomePage} />
              {ctx ? <>
              { ctx.isAdmin && <Route path="/admin" exact component={AdminPage} />}
              <Route path="/profile" exact component={Profile} />
              </>
               : 
               <>
              <Route path="/login" component={Login} />
              {/* <Route path="/register" component={Register} /> */}
              </>
              }
            </Switch>
          </Context>
      </Router>
  );
}

export default App;
