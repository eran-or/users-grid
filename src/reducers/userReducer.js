import * as actions from '../actions/actionTypes'
import produce from "immer"

export const userReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case actions.UPDATE_USERS:
        const withoutArchivedUsers = action.users.filter(user=>{
          return !draft.usersArchive.includes(user.id)
        })
        draft.list = withoutArchivedUsers
        return
      case actions.API_ERROR:
        draft.err = action.err
        return
      case actions.ARCHIVE_USER:
        draft.usersArchive = [...draft.usersArchive, action.userId]
        return
      default:
        return draft
    }
  }, {list: [], usersArchive:[]})