import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './NavLinks.css';

const NavLinks = (props) => {
  const { isLoggedIn, userId, logout } = useAuth();

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact={true.toString()}>
          ALL Cities and resturents
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to={`/${userId}/orders`}>MY orders</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to="/resturent/new">ADD Resturent</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <button onClick={logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
