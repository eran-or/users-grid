import React, { useEffect } from 'react';
import theme from './users.module.css';
import modalHoc, { ModalTriger } from '../../base/modal/Modal';
import UserForm from './UserForm';
import UsersList from './UsersList';
import Button from '@material-ui/core/Button';
import { fetchUsers } from '../../actions/userActions'
import { useSelector, useDispatch } from 'react-redux'

const UserModal = modalHoc(UserForm)

const Users = props => {  
  const users = useSelector(state => state.users.list)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch]);


  return (<div className={theme.users}>
    <div className={theme["add-user-button"]}>
      <div style={{width:'fit-content'}}>
      <UserModal>
        <ModalTriger><Button variant="outlined" color="primary" style={{fontWeight: 'bold'}}>+ Add New User</Button></ModalTriger>
      </UserModal>
      </div>
    </div >
      
      <UsersList users={users} />
      </div>);
}

export default Users;