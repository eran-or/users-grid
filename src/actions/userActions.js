import * as actions from './actionTypes'
export const fetchUsers = () => {
  return function (dispatch, getState) {
    const fetchAction = () => window.medAPI.users.list().then(res => res).catch(err => err)
    let tries = 0
    async function getUsers() {
      const res = await fetchAction()
      if (Array.isArray(res)) {
        return dispatch({
          type: actions.UPDATE_USERS,
          users: res,
        });
      } else {
        if (!res.success) {
          if (tries < 10) {
            tries++
            getUsers()
          } else {
            dispatch({
              type: actions.API_ERROR,
              err: res.error,
            });
            return res.error
          }
        }
      }
    }
    getUsers()
  }
}


export const addUser = (...user) => {
  return function (dispatch, getState) {
    const fetchAction = (...user) => window.medAPI.users.add(...user).then(res => res).catch(err => err)
    let tries = 0
    async function saveUser(...user) {
      const res = await fetchAction(...user)
      if (res.success) {
        dispatch(fetchUsers())
        return 'success'
      } else {
        if(res.error instanceof Object && !(res.error instanceof Array)){
          dispatch({
            type: actions.API_ERROR,
            err: res.error
          })
          return {error: res.error.message}
        }else{
          if (res.error.includes("Database is busy") && tries < 10) {
            tries++
            return saveUser(...user)
          }
          dispatch({
            type: actions.API_ERROR,
            err: res.error
          })
          return {error: res.error}
        }
      }
    }
    return saveUser(...user)
  }
}

export const archiveUser = (userId) => {
  return function (dispatch, getState) {
    dispatch({
      type: actions.ARCHIVE_USER,
      userId
    })
    dispatch(fetchUsers())
  }
}


export const editUser = (user_id, update_obj) => {

  const fetchAction = (id, user) => window.medAPI.users.update(id, user).then(res => res).catch(err => err)
  return function (dispatch, getState) {
    let tries = 0
    async function updateUser(user_id, update_obj) {
      const res = await fetchAction(user_id, update_obj)
      if (res.success) {
        dispatch(fetchUsers())
        return 'success'
      } else {
        if(res.error instanceof Object && !(res.error instanceof Array)){
          dispatch({
            type: actions.API_ERROR,
            err: res.error
          })
          return {error: res.error.message}
        }else{
          if (res.error.includes("Database is busy") && tries < 10) {
            tries++
            return updateUser(user_id, update_obj)
          }
          dispatch({
            type: actions.API_ERROR,
            err: res.error
          })
          return {error: res.error}
        }
      }
    }
    return updateUser(user_id, update_obj)
  }
}