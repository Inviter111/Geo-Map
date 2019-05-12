import React from 'react'
import axios from 'axios'
import { Grid, Form, Segment, Button } from 'semantic-ui-react';

import Snackbar from './Snackbar'
import { Redirect } from 'react-router';

interface State {
  email: string
  password: string
  message: string,
  color: any,
  redirect: boolean,
  loading: boolean
}

class Login extends React.Component<{onLogin: any}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      email: '',
      password: '',
      message: '',
      color: null,
      redirect: false,
      loading: false
    } 
  }

  onInputChange = (field: string) => (event: any) : void => {
    this.setState({ [field]: event.target.value } as State)
  }

  onLogin = async () => {
    this.setState({ loading: true })
    try {
      const res = await axios.post('https://report.iotfactory.eu/login', {
        email: this.state.email,
        password: this.state.password
      })
      window.localStorage.setItem('token', res.data._id)
      this.props.onLogin.setToken(res.data._id)
      this.setState({ redirect: true, loading: false })
    } catch (err) {
      console.log(err)
      this.setState({ loading: false })
      this.setState({ message: 'Error occurred while logging in!', color: 'red' })
      const snackbar = document.getElementById('snackbar')
      if (snackbar) {
        snackbar.className = 'show'
        setTimeout(() => {
          snackbar.className = snackbar.className.replace('show', '')
          this.setState({ message: '', color: null })
        }, 3000)
      }
    }
  }

  render() {
    const { email, password, message, color, redirect, loading }: State = this.state
    return (
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}
        </style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Form size='large' loading={loading}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='E-mail address'
                  onChange={this.onInputChange('email')}
                  value={email}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={this.onInputChange('password')}
                  value={password}
                />
                <Button color='blue' fluid size='large' onClick={this.onLogin}>
                  Login
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
        <Snackbar message={message} color={color} />
        {redirect && <Redirect to='/' />}
      </div>
    )
  }
}

export default Login
