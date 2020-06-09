import React, { useState, useEffect } from 'react';
import { Field, Formik } from 'formik';
import styled from 'styled-components';
import theme from './permissions.module.css';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

const Line = styled.hr`
margin: 10px 0;
`

const CheckboxWrapper = (props) => {
  return <FormControlLabel className={props.className} control={<Checkbox {...props} />} label={props.label} />
}

const GreenCheckbox = withStyles({
  root: {
    color: '#4EC185',
    '&$checked': {
      color: '#4EC185',
    },
  },
  checked: {},
})((props) => <CheckboxWrapper color="default" {...props} />);

const getHospitals = () => window.medAPI.hospitals.list().then(res => res).catch(err => err)

const Permissions = (props) => {
  const { onChange, clear, selectedPermissions, editMode } = props
  const [allChecked, setAllChecked] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [checked, setChecked] = useState([])

  useEffect(() => {
    /// fetch all hospitals
    let tries = 0;
    async function getHospitalsAction() {
      const arr = await getHospitals()
      if (Array.isArray(arr)) {
        setHospitals(arr)
      } else {
        if (!arr.success) {
          if (tries < 10) {
            tries++
            getHospitalsAction()
          } else {
            console.error(arr.error)
          }
        }
      }
    }
    getHospitalsAction()
  }, [])

  useEffect(() => {
    /// set checked/unchecked of selected permissions
    const selected = selectedPermissions ? selectedPermissions.reduce((a, n) => ((a[n] = true, a)), {}) : {};
    let arr;
    if (!selectedPermissions) {
      arr = hospitals.map(_ => false)
    } else {
      arr = hospitals.map(h => (selected[h.id])? true : false)
    }
    setChecked(arr)
  }, [hospitals, selectedPermissions])

  useEffect(() => {
    /// clear checkboxes after submit form (but not in edit mode) 
    if (clear) {
      const arr = hospitals.map(_ => false)
      setAllChecked(false)
      setChecked(arr)
    }
  }, [clear, hospitals])

  const handleChecked = (index, event) => {
    let arr = [...checked]
    arr[index] = event.target.checked
    setChecked(arr)
    const allChecked = arr.filter((c) => c).length === arr.length
    if (allChecked) {
      onChange(hospitals)
      arr = arr.map(_ => false)
      setChecked(arr)
      setAllChecked(allChecked)
    } else {
      const selected = hospitals.reduce((acc, next, i) => {
        if (arr[i]) {
          acc.push(next.id)
        }
        return acc
      }, [])
      onChange(selected)
    }
  }

  const handleAllChecked = event => {
    const arr = checked.map(_ => false)
    setChecked(arr)
    const allChecked = event.target.checked ? true : false
    setAllChecked(allChecked)
    if (allChecked) {
      onChange([], true)
    } else {
      onChange([])
    }
  }
  
  return (
    <Formik>
      <div>
        <Line />
        <div style={{ color: "#00000061", marginBottom: '10px' }}>PERMISSIONS</div>
        <div className={theme.all_hospitals}>
          <Field className={theme.all_hospitals} disabled={(!!selectedPermissions && !editMode)} name='all_hospitals' label='All Hospitals in network' component={GreenCheckbox}
            checked={allChecked} onChange={handleAllChecked} />

        </div>
        <div style={{ margin: "7px 20px" }}>can view only:</div>
        <div className={theme.permissions}>
          {hospitals.map((h, i) => {
            const disabled = allChecked || (!!selectedPermissions && !editMode)
            return <Field key={i} className={theme.all_hospitals} name={"hospitalIds"} label={h.name} component={GreenCheckbox}
              checked={!!checked[i]} disabled={disabled} onChange={(event) => handleChecked(i, event)} />
          })}
        </div>
      </div>
    </Formik>
  );
};

export default Permissions;