import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { archiveUser } from '../../actions/userActions';
import { useDispatch } from 'react-redux'

const Row = styled.div`
    display:flex;
    justify-content:flex-end;
    position: relative;
    left: 30px;
`
const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
`
const DeleteUserDialogContent = (props) => {

  const { onClose, user } = props
  const dispatch = useDispatch()

  const handleConfirm = () => {
    dispatch(archiveUser(user.id))
    
    
    onClose()
  }

  return (
    <Content>
        <h3>Are you sure you want to delete this user?</h3>
        <p style={{color:'#00000061', lineHeight: '2em', marginTop: 0}}>Clicking OK will delete all user details and and move it to archive</p>
      <Row>
        <Button onClick={onClose} style={{color:'#00000061', fontWeight:'bold'}}>CANCEL</Button>
        <Button onClick={handleConfirm} style={{color:'#4EC185', fontWeight:'bold'}}>OK</Button>
      </Row>
    </Content>
  )
}

export default DeleteUserDialogContent