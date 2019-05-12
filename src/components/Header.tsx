import React from 'react'

import { Menu, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

interface Props {
  ref: any
}

interface State {
  token: string
}

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      token: window.localStorage.getItem('token') || ''
    }
  }

  setToken(token: string) {
    this.setState({ token })
  }

  render() {
    const { token } = this.state
    return (
      <Menu
        secondary
      >
        <Container>
          <Menu.Item as={Link} to='/'>
            Map
          </Menu.Item>
          {token ?
            <Menu.Item as={Link} position='right' onClick={() => {
              this.setState({ token: '' })
              window.localStorage.removeItem('token')}
            }>
              Logout
            </Menu.Item> :
            <Menu.Item as={Link} position='right' to='/login'>
              Login
            </Menu.Item>
          }
        </Container>
      </Menu>
    )
  }
}

export default Header
