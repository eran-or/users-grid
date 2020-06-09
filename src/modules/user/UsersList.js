import React from 'react';
import Card from '@material-ui/core/Card';
import styled from 'styled-components';
import Gravatar from 'react-gravatar';
import CardContent from '@material-ui/core/CardContent';
import theme from './usersList.module.css';
import Permissions from './Permissions';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DeleteUserDialogContent from './DeleteUserDialogContent';
import modalHoc, { ModalTriger } from '../../base/modal/Modal';
import { useSelector } from 'react-redux';
import UserForm from './UserForm';

const DeleteUserDialog = modalHoc(DeleteUserDialogContent)
const UserModal = modalHoc(UserForm)

const Grid = styled.div`
  display:grid;
  grid-template-columns: repeat(auto-fill, 209px);
  grid-gap: 41px;
  justify-items:center;
  justify-content:center;
`
function UsersList(props) {
  const users = useSelector(state => state.users.list)

  return (

    <Grid>
      {users.map(user => {
        return <Card key={user.id} className={theme.card}>
          <CardContent className={theme["card-content"]}>
            <div className={theme["actions-buttons"]}>
              <UserModal user={user}>
                <ModalTriger>
                  <EditIcon color="action" />
                </ModalTriger>
              </UserModal>

              <DeleteUserDialog width={280} height={192} customStyles={{ padding: '15px 30px' }} showCloseButton={false} closeMaskOnClick={false}
                user={user}>
                <ModalTriger>
                  <DeleteIcon color="action" />
                </ModalTriger>
              </DeleteUserDialog>
            </div>
            <div>
              <Gravatar className={theme.avatar} email={user.email} />
            </div>
            <strong className={theme["user_name"]}>{user.first_name} {user.last_name}</strong>
            <small>{user.email}</small>
            <Permissions clear={false} selectedPermissions={user.permissions.hospitals} />
          </CardContent>
        </Card>
      })}
    </Grid>
  );
}

export default UsersList;