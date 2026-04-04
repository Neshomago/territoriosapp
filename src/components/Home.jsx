import React from 'react'
import { Card, CardHeader, CardBody, Image, Button, CardFooter } from '@heroui/react'
import { Progress } from '@heroui/react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";

import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import NavbarApp from './NavbarApp';
import FooterNavbar from './FooterNavbar';

export const Home = () => {
    const navigate = useNavigate();
    const {user} = useAuth();

/*     const handleGoClick = () => {
        useNavigate('/grupo');
    } */
    const handleGrupos = async () => {
        navigate('/grupo');
    }; 

  return (
    <>
        <NavbarApp />
        <div className='p-4'>
        <Card isFooterBlurred className='w-full h-[330px] mt-3'>
        <CardHeader className='absolute z-10 top-1'>
        <p className="text-big text-black uppercase font-bold">🏘️Predicación de casa en casa</p>
        </CardHeader>
            <Image
                removeWrapper
                className='z-0 w-full h-full object-cover'
                src="https://cms-imgp.jw-cdn.org/img/p/2024360/univ/art/2024360_univ_cnt_5_lg.jpg">
            </Image>
            <CardFooter className='justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 z-10'>
                <Button  onPress={handleGrupos}>🌞 Ir a territorios de Predicación</Button>
                {/* <Button disabled>🌆 Tarde</Button>
                <Button disabled>🌝 Noche</Button> */}
            </CardFooter>
        </Card>

        <Card className='w-full h-[400px] mt-5'>
        <CardBody>
            <CardHeader>
            {/* 📊Territorios Completados */}
            ⛔️ NO Predicar estas Casas
            </CardHeader>
            <Table isStriped aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>ETAPA</TableColumn>
                    <TableColumn>MANZANA</TableColumn>
                    <TableColumn>VILLA</TableColumn>
                    <TableColumn>REFERENCIA</TableColumn>
                    <TableColumn>FECHA</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow key="1">
                    <TableCell>4ta</TableCell>
                    <TableCell>EC</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>Al lado del hno. Otto</TableCell>
                    <TableCell>08-Jul-2025</TableCell>
                    </TableRow>
                    <TableRow key="2">
                    <TableCell>4ta</TableCell>
                    <TableCell>DP</TableCell>
                    <TableCell>6 o 12</TableCell>
                    <TableCell>tercera casa a la izquerda de la villa 9</TableCell>
                    <TableCell>19-Jul-2025</TableCell>
                    </TableRow>
                    <TableRow key="3">
                    <TableCell>4ta</TableCell>
                    <TableCell>DC</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>07-Jul-2025</TableCell>
                    </TableRow>
                    <TableRow key="4">
                    <TableCell>4ta</TableCell>
                    <TableCell>FO</TableCell>
                    <TableCell>??</TableCell>
                    <TableCell>techo rojo al lado de hna norika</TableCell>
                    <TableCell>16-Jul-2025</TableCell>
                    </TableRow>
                    <TableRow key="5">
                    <TableCell>4ta</TableCell>
                    <TableCell>DC</TableCell>
                    <TableCell>11</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>02-Ago-2025</TableCell>
                    </TableRow>
                    <TableRow key="6">
                    <TableCell>4ta</TableCell>
                    <TableCell>DM</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>06-Ago-2025</TableCell>
                    </TableRow>
                    <TableRow key="7">
                    <TableCell>4ta</TableCell>
                    <TableCell>FL</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>06-Ago-2025</TableCell>
                    </TableRow>
                    <TableRow key="8">
                    <TableCell>5ta</TableCell>
                    <TableCell>CX</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>02-Ago-2025</TableCell>
                    </TableRow>
                    <TableRow key="9">
                    <TableCell>9na</TableCell>
                    <TableCell>934</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>26-Jul-2025</TableCell>
                    </TableRow>
                    <TableRow key="10">
                    <TableCell>9na</TableCell>
                    <TableCell>928</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>02-Ago-2025</TableCell>
                    </TableRow>
                    <TableRow key="11">
                    <TableCell>11va</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>02-Ago-2025</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* <ul>
                <Progress 
                classNames={{
                base: "max-w-md",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                }}
                size='sm' radius='lg' label="Murillo" value={65} showValueLabel></Progress>
                <Progress 
                classNames={{
                base: "max-w-md",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                }}
                size='sm' radius='lg' label="Jara" value={0} showValueLabel></Progress>
                <Progress
                classNames={{
                base: "max-w-md",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                }}
                size='sm' radius='lg' label="Mosquera" value={5} showValueLabel></Progress>
                <Progress
                classNames={{
                base: "max-w-md",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                }}
                size='sm' radius='lg' label="Echeverría" value={0} showValueLabel></Progress>
                <Progress
                classNames={{
                base: "max-w-md",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                }}
                size='sm' radius='lg' label="Mejía" value={0} showValueLabel></Progress>
                <Progress
                classNames={{
                base: "max-w-md",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                }}
                size='sm' radius='lg' label="León" value={0} showValueLabel></Progress>
            </ul> */}
        </CardBody>
        </Card>

        <Card className='w-full h-[100px] mt-5 mb-10'>
            <CardHeader>
            ⌚️Horario Asignado
            </CardHeader>
            <p> {user.horario && user.territorio ? `${user.horario} • ${user.territorio}` : 'No tiene un horario asignado por ahora'}</p>
        </Card>
        </div>
        <FooterNavbar />
    </>
  )
}
