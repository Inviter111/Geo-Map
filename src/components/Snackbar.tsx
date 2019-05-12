import React from 'react'
import { Message, Grid } from 'semantic-ui-react';
import './Snackbar.css'

interface Props {
  message: string,
  color: any
}

const Snackbar:React.FC<Props> = (props) => {
  const { message, color } = props
  return (
    <Grid centered>
      <div id='snackbar'>
        <Message color={color}>
          <Message.Header>{message}</Message.Header>
        </Message>
      </div>
    </Grid>
  )
}

export default Snackbar