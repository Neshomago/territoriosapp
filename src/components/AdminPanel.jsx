import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { db, COLLECTIONS } from './firebase';
import { updateUserData } from './AuthUserService';
import { useAuth } from './AuthProvider';
import {
  getUserRole,
  canAssignRole,
  ASSIGNABLE_ROLES,
} from './utils/userAccess';
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';

const ROLE_LABELS = {
  user: 'Usuario',
  admin: 'Admin',
  manager: 'Gerente',
  superuser: 'Superusuario',
};

const STATUS_LABELS = {
  approved: 'Aprobado',
  rejected: 'Rechazado',
  pending: 'Pendiente',
};

const STATUS_COLORS = {
  approved: 'success',
  rejected: 'danger',
  pending: 'warning',
};

export const AdminPanel = () => {
  const { profile: myProfile } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.USERS),
      (snapshot) => {
        setUsers(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      }
    );

    return () => unsubscribe();
  }, []);

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const otherUsers = users.filter((u) => u.status !== 'pending');

  const approveUser = (uid) => updateUserData(uid, { status: 'approved' });
  const rejectUser = (uid) => updateUserData(uid, { status: 'rejected' });
  const assignRole = (uid, newRole) => updateUserData(uid, { role: newRole });

  return (
    <>
      <NavbarApp />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-10">
        {/* =========================================
            SOLICITUDES PENDIENTES
        ========================================= */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Solicitudes pendientes
          </h2>

          {pendingUsers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay solicitudes pendientes.
            </p>
          ) : (
            <Table aria-label="Solicitudes pendientes">
              <TableHeader>
                <TableColumn>USUARIO</TableColumn>
                <TableColumn align="center">ACCIONES</TableColumn>
              </TableHeader>
              <TableBody items={pendingUsers}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <User
                        description={item.email}
                        name={item.name || item.email}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onPress={() => approveUser(item.id)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() => rejectUser(item.id)}
                        >
                          Rechazar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </section>

        {/* =========================================
            USUARIOS
        ========================================= */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Usuarios
          </h2>

          <Table aria-label="Usuarios">
            <TableHeader>
              <TableColumn>USUARIO</TableColumn>
              <TableColumn>ROL</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn align="center">ACCIONES</TableColumn>
            </TableHeader>
            <TableBody items={otherUsers}>
              {(item) => {
                const currentRole = getUserRole(item);
                const assignableRoles = ASSIGNABLE_ROLES.filter((candidate) =>
                  canAssignRole(myProfile, currentRole, candidate)
                );
                const canEditRole = assignableRoles.length > 0;

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <User
                        description={item.email}
                        name={item.name || item.email}
                      />
                    </TableCell>
                    <TableCell>
                      {canEditRole ? (
                        <Select
                          aria-label="Rol"
                          size="sm"
                          className="w-40"
                          selectedKeys={[currentRole]}
                          onChange={(e) =>
                            assignRole(item.id, e.target.value)
                          }
                        >
                          {assignableRoles.map((roleOption) => (
                            <SelectItem key={roleOption} value={roleOption}>
                              {ROLE_LABELS[roleOption]}
                            </SelectItem>
                          ))}
                        </Select>
                      ) : (
                        <Chip size="sm" variant="flat">
                          {ROLE_LABELS[currentRole]}
                        </Chip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={STATUS_COLORS[item.status] || 'default'}
                      >
                        {STATUS_LABELS[item.status] || 'Aprobado'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {item.status === 'rejected' && canEditRole && (
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            onPress={() => approveUser(item.id)}
                          >
                            Reactivar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        </section>
      </div>

      <FooterNavbar />
    </>
  );
};
