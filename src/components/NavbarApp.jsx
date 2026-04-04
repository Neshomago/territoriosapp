import React from 'react'
import { useNavigate } from 'react-router-dom';
import {Navbar, NavbarContent, NavbarItem, User, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu} from "@heroui/react";
import { useAuth } from './AuthProvider';

const NavbarApp = () => {

  const {logout, user} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  }; 

  return (
    <>
    <Navbar className='shadow-md'>
      <NavbarContent>
        <Dropdown>
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                  src: user.photoURL,
                  isBordered: true,
              }}
              className='transition-transform'
              description={user.email}
              name={user.displayName}
              />
            {/* <Avatar showFallback name='AT' src='https://images.unsplash.com/broken' /> */}
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Revisar PDF</DropdownItem>
            <DropdownItem>Cerrar Sesión</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {user && (<Button onPress={handleLogout}> Salir </Button>)}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </>
  )
}

export default NavbarApp