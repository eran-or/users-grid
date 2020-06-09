import React from 'react'
import logo from '../../graphics/logo_icon_inverse.svg'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import theme from './header.module.css'
import logoIcon from '../../graphics/medigate-logo.svg'

const CustomLink = styled(NavLink)`
    border:${props => props.border ? props.border : ''};
    text-align:center;
    color:white;
    text-decoration:none;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 5px solid transparent;
    padding-top:5px;
`
const Header = (props) => {
  
  return (
    <header className={theme.header}>
      <img src={logo} alt="" height="24" />

      <div className={theme.nav}>
        <CustomLink exact to="/users" activeClassName={theme["header-active-link"]}>Users</CustomLink>
        <CustomLink exact to="/alerts" activeClassName={theme["header-active-link"]}>Alerts</CustomLink>
      </div>
      <div className={theme["header-right"]}>
        <div className={theme["logo-icon"]}>
          <img src={logoIcon} alt="" width="24" />

        </div>
        <div className={theme["header-right-details"]}>
          <div>Medigate User</div>
          <div>Hi</div>
          <div>LogOut</div>
        </div>
      </div>
    </header>
  );
}

export default Header;