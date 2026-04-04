/* import { Button, Card, CardBody, Progress, Checkbox, useDisclosure, CardHeader, Divider } from '@nextui-org/react'
import { Modal, ModalContent, ModalBody, Image, Spinner } from '@nextui-org/react'
import { Select, SelectItem } from "@nextui-org/react";
import { territorios } from './utils/_utils';
import teritorio from './../assets/territorio-mejia.png'; */
import React, { useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import { EyeIcon, DeleteIcon, EditIcon } from './utils/_icons.jsx';
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';
/* import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Importa la configuración de Firebase
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import {useDatosGrupoContext} from './contexts/grupoContext'; */

export const columns = [
  {name: "NAME", uid: "name"},
  {name: "ROLE", uid: "role"},
  {name: "STATUS", uid: "status"},
  {name: "GRUPO", uid: "grupo"},
  {name: "ACTIONS", uid: "actions"},
];

export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "Anciano",
    team: "Servicio",
    status: "active",
    grupo: 'Flia. Jara',
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Siervo Ministerial",
    team: "",
    status: "paused",
    grupo: 'Flia. Villareal',
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Siervo Ministerial",
    team: "Precursor Regular",
    status: "active",
    grupo: 'Flia. Murillo',
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "Tony Reichert",
    role: "Anciano",
    team: "Coordinador",
    status: "active",
    grupo: 'Flia. Leon',
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 5,
    name: "Tony Reichert",
    role: "Anciano",
    team: "Secretario",
    status: "active",
    grupo: 'Flia. Mejía',
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
];

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const renderCell = (user, columnKey) => {
  const cellValue = user[columnKey];

  switch (columnKey) {
    case "name":
      return (
        <User
          avatarProps={{radius: "lg", src: user.avatar}}
          description={user.email}
          name={cellValue}
        >
          {user.email}
        </User>
      );
    case "role":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-sm capitalize">{cellValue}</p>
          <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
        </div>
      );
    case "status":
      return (
        <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
          {cellValue}
        </Chip>
      );
    case "grupo":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-sm capitalize text-default-400">{user.grupo}</p>
        </div>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Edit user">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete user">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return cellValue;
  }
};

export const AdminPanel = () => {
  return (
    <>
    <NavbarApp></NavbarApp>
      <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    <FooterNavbar></FooterNavbar>
    </>
  );
}

