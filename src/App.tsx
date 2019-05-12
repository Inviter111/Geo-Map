import { hot } from 'react-hot-loader'
import React from 'react';
import { Route, Redirect } from 'react-router-dom'

import Header from './components/Header'
import Login from './components/Login'
import Map from './components/Map'

class App extends React.Component {
  private header: React.RefObject<any>
  constructor(props: any) {
    super(props)
    this.header = React.createRef()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Header ref={this.header} />
        </header>
        <Route path='/login' component={() => <Login onLogin={this.header.current} />} />
        <Route exact path='/' render={() => 
          window.localStorage.getItem('token') ?
            (<Map />) : (<Redirect to='/login' />)
        } />
      </div>
    );
  }
}

export default hot(module)(App);
