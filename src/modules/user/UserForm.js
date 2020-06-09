import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import validator from 'validator'
import styled from 'styled-components';
import theme from './userForm.module.css';
import Button from '@material-ui/core/Button';
import Permissions from './Permissions';
import { addUser, editUser } from '../../actions/userActions'
import { useDispatch } from 'react-redux'

const SubmitButton = styled(Button)`
  &&&{
    font-size:10px;
  }
`
const Line = styled.hr`
margin: 10px 0;
`
const Header = styled.div`
    font-weight:bold;
    margin-bottom:15px;
`
const UserForm = (props) => {
  const [requestMessage, setFormRequestMessage] = useState('')
  const { user } = props
  const [selectedHospitals, setSelectedHospitals] = useState([])
  const [clearPermissions, setClearPermissions] = useState(false)
  const [allSelected, setAllSelected] = useState(false)
  const dispatch = useDispatch()
  
  const handlePermissionsChange = (hospitals, allSelected) => {
      setSelectedHospitals(hospitals)
      setAllSelected(!!allSelected)
  }

  const editMode = user? true : false
  useEffect(()=>{
    if(editMode){  
      setSelectedHospitals(user.permissions.hospitals)
      setAllSelected(user.permissions.all_hospitals)
    }
  },[editMode, user])  
  
  return <div>
    <Header>{editMode? 'EDIT USER' : 'NEW USER'}</Header>
    <Formik
      initialValues={{ email: editMode? user.email : '', firstname: editMode? user.first_name : '', lastname: editMode? user.last_name : '' }}
      validate={values => {

        const errors = {};
        if (!values.email) {
          errors.email = 'Email is required';
        } else if (
          !validator.isEmail(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        if (!values.firstname) {
          errors.firstname = 'Firstname is required'
        }
        if (!values.lastname) {
          errors.lastname = 'Lastname is  required'
        }
        return errors;
      }}

      onSubmit={(values, { setSubmitting, resetForm }) => {
        let userPermissions;
        if(allSelected){
          userPermissions = []
        }else{
          userPermissions = selectedHospitals
        }
        const { firstname, lastname, email } = values

        async function saveUser() {
          let res
          if(!editMode){
            res = await dispatch(addUser(firstname, lastname, email, allSelected, userPermissions)).then(res=> res).catch(err=> err)
          }else{
            
            const update_obj = {
              id: user.id,
              first_name:firstname,
              last_name: lastname, 
              email,
              permissions:{
                all_hospitals: allSelected,
                hospitals: userPermissions
              }
            }
            res = await dispatch(editUser(user.id, update_obj)).then(res=>res).catch(err=>err)
          }
          if(res === 'success'){
            setFormRequestMessage('user saved!')
            if(!editMode){
              resetForm()
              setClearPermissions(true)
              setClearPermissions(false)
            }else{
              setClearPermissions(false)
            }
          }else{
            setFormRequestMessage(res.error)
          }
        }
        saveUser()
        setSubmitting(false)
      }}>
      {({ isSubmitting, values }) => (
        <Form>
          <div>
            <div className={theme.row}>
              <div style={{ marginRight: '20px', flex: '1', height:'54px' }}>
                <Field type="text" name="firstname">
                {({ field }) => <input type="text" placeholder="Firstname" {...field}
                onChange={(e) => {
                  setFormRequestMessage('')
                  field.onChange(e)
                }} />}
            </Field>
                <ErrorMessage name="firstname" component="div" style={{ color: "red" }} />
              </div>
              <div style={{ flex: "1" }}>
                <Field type="text" name="lastname">
                {({ field }) => <input type="text" placeholder="Lastname" {...field}
                onChange={(e) => {
                  setFormRequestMessage('')
                  field.onChange(e)
                }} />}
            </Field>
                <ErrorMessage name="lastname" component="div" style={{ color: 'red' }} />
              </div>
            </div>
            <Field type="text" name="email">
              {({ field }) => <input type="text" placeholder="Email" {...field}
                onChange={(e) => {
                  setFormRequestMessage('')
                  field.onChange(e)
                }} />}
            </Field>
            <div style={{ height: "8px", color: 'red' }}>
              <ErrorMessage name="email" component="div" />
            </div>
            <Permissions onChange={handlePermissionsChange} clear={clearPermissions} 
              selectedPermissions={editMode? selectedHospitals : ''} editMode={editMode} />
            <Line />
            <div className={theme.add_user_button}>
              <div className={requestMessage === 'user saved!'? theme.info : theme.error}>{requestMessage}</div>
              <SubmitButton type="submit" color="primary" variant="contained" disabled={isSubmitting}>{editMode? 'SAVE' : 'ADD USER'}</SubmitButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  </div>

}

export default UserForm