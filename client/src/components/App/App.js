import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import API from '../../lib/API';
import TokenStore from '../../lib/TokenStore';
import AuthContext from '../../contexts/AuthContext';
import Navigation from '../../components/Navigation/Navigation';
import PrivateRoute from '../../components/PrivateRoute/PrivateRoute';
import Home from '../../pages/Home/Home';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import CharacterSelect from '../../pages/CharacterSelect/CharacterSelect';
import EnemySelect from '../../pages/EnemySelect/EnemySelect';
import Battle from '../../pages/Battle/Battle';
import NotFound from '../../pages/NotFound/NotFound';
import Results from '../../pages/Results/Results';
import Gameover from '../../pages/Gameover/Gameover';


import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = (user, authToken) => {
      TokenStore.setToken(authToken);
      this.setState(prevState => ({ auth: { ...prevState.auth, user, authToken } }));
    };

    this.handleLogout = () => {
      TokenStore.clearToken();
      this.setState(prevState => ({ auth: { ...prevState.auth, user: undefined, authToken: undefined } }));
    }

    this.state = {
      auth: {
        user: undefined,
        authToken: TokenStore.getToken(),
        onLogin: this.handleLogin,
        onLogout: this.handleLogout
      }
    }
  }

  componentDidMount() {
    const { authToken } = this.state.auth;
    if (!authToken) return;

    API.Users.getMe(authToken)
      .then(response => response.data)
      .then(user => this.setState(prevState => ({ auth: { ...prevState.auth, user } })))
      .catch(err => console.log(err));
  }

  render() {
    const navSize = (this.state.auth.user && window.innerWidth > 992)  ? "nav-lg" : "nav-sm"
    console.log(navSize)
    return (
      <AuthContext.Provider value={this.state.auth}>
        <div className='App'>
          <Navigation />
          <div className={navSize}>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <PrivateRoute path='/character' component={CharacterSelect} />
              <PrivateRoute path='/enemy' component={EnemySelect} />
              <PrivateRoute path='/battle' component={Battle} />
              <PrivateRoute path='/results' component={Results} />
              <PrivateRoute path='/gameover' component={Gameover} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
