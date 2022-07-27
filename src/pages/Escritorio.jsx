import React, {useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Typography, Button, Divider, Table, Modal, Image } from 'antd';
import { CloseCircleOutlined, RightOutlined } from '@ant-design/icons';

import { SocketContext } from '../context/SocketContext';
import { useHideMenu } from '../hooks/useHideMenu';

import { getUsuarioStorage } from '../helpers/getUsuarioStorage';
import { Navigate, useNavigate } from 'react-router-dom';

import logoPng from '../static/logo.png';

const { Title, Text } = Typography;

const columns = [
  {
    title: 'Ticket',
    dataIndex: 'ticket',
    key: 'ticket'
  },
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre'
  },
  {
    title: 'Creacion Ticket',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
];

const config = {
  title: 'Tickes - IMA',
  content: (
    <>
      <p>No hay tickets pendientes</p>
    </>
  ),
};

export const Escritorio = () => {
  useHideMenu(false);
  const navigate = useNavigate ();

  const [usuario] = useState(getUsuarioStorage());
  const { socket } = useContext( SocketContext );
  const [ ticket, setTicket]  = useState(null);
  const [escritorios,setEscritorios] = useState([]);
  const [selectionType, setSelectionType] = useState(null);
  const [modal, contextHolder] = Modal.useModal();

  const salir = () => {
    localStorage.clear();
    navigate("/ingresar", { replace: true }) 
  }

  useEffect(() => {
    listTicket()
    // eslint-disable-next-line 
  }, []);

  // Avisar que llego ticket nuevo
  useEffect(() => {
    socket?.on('solicitar-ticket', (valor) =>{
      const escritorio = localStorage.getItem('escritorio');
      if (escritorio === valor){
        const audio = new Audio('../../public/new-ticket.mp3');
        audio.play();
        window.location.reload();
      }
    })
  }, [socket])

  // Get List Ticket x ventanilla
  const listTicket = async() => {
    const escritorio = localStorage.getItem('escritorio');
    const numEmpleado = localStorage.getItem('numEmpleado');
    const juridico = localStorage.getItem('juridico');
    const respuesta = await Axios.get('https://glacial-tor-72395.herokuapp.com/api/ticket/escritorio/',{
      params:{
        'escritorio': escritorio,
        'numEmpleado': numEmpleado,
        'juridico': juridico
      }
    });
    console.log(respuesta.data.rows);
    const ticketList = respuesta.data.rows;
    // console.log(ticketList);
    setEscritorios(ticketList);
  }

  const siguienteTicket = async() => {
    const ticketST = selectionType.selectionType[0];
    
    // Traer nombre Ticket
    // console.log(selectionType.selectionType[0]);
    const respuesta = await Axios.get('https://glacial-tor-72395.herokuapp.com/api/ticket/nombre/',{
      params:{
        'ticket': ticketST,
        'escritorio': localStorage.escritorio,
        'numEmpleado': localStorage.numEmpleado,
        'juridico': localStorage.juridico
      }
    });
    const dataNom = respuesta.data.rows;

    // console.log(dataNom[0].nombre);
    const nom = dataNom[0].nombre;

    let escritorio = '';
    // SI ES JURIDICO SACAR ESCRITORIO COM NUM EMPLEADO
    if (localStorage.juridico === '1') {
      const j = await Axios.get('https://glacial-tor-72395.herokuapp.com/api/juridicos/escritorio/',{
        params:{
          'numEmpleado': localStorage.numEmpleado
        }
      });
      // console.log(j.data.rows);
      const r = j.data.rows;
      escritorio = r[0].Id;
    }else{
      escritorio = localStorage.escritorio;
    }

    const data ={
      'nom': nom,
      't': ticketST,
      'numEmpleado': localStorage.numEmpleado,
      'escritorio': escritorio
    }
    // console.log('DATA ' + data);
    socket.emit('siguiente-ticket-trabajar', data, (ticket) => {
      // validar si hay ticket 
      console.log(nom);
      if(ticket){
        // const texto = "Ticket " + ticket.numero + " pasar a ventanilla " + ticket.escritorio;
        console.log(ticket.escritorio);
        const texto = nom + " favor de pasar a ventanilla " + ticket.escritorio;
        speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
        setTicket(ticket);
      } else {
        modal.info(config);
      }
      window.location.reload();
    });
  }

  if (!usuario.numEmpleado || !usuario.escritorio ){
    return <Navigate to="/ingresar" /> 
  }

  const onRowKeysChange = selectionType => {
    setSelectionType({ selectionType });
  };

  const rowSelection = {
    type: 'radio',
    selectionType,
    onChange: onRowKeysChange,
  };

  return (
    <>
      <Image
        preview={false}
        width={200}
        src={ logoPng }
      />
      <Divider/>
      <Row>
        <Col span={20} >
          <Title level={2}>{usuario.numEmpleado}</Title>
          <Text>Usted está trabajando en el escritorio: </Text>
          <Text type="success">{usuario.escritorio}</Text>
        </Col>

        <Col span={24} align="right">
          <Button shape='round' type="danger" onClick={ salir }>
            <CloseCircleOutlined />
            Salir
          </Button>
        </Col>
      </Row>

      <Divider/>

      <Row>
        <Col offset={18} span={6} align="right">
          <Button onClick={ siguienteTicket } shape="round" type="primary">
            <RightOutlined />
            Siguiente
          </Button>
        </Col>
        <Col span={18}>
          <Table
            rowSelection={rowSelection}
            rowKey={"ticket"}
            columns={columns}
            dataSource={escritorios}
          />
        </Col>
      </Row>

      <Divider/>

      {
        ticket && (
          <Row>
            <Col>
            <Text>Está atendiendo el ticket número: </Text>
            <Text style={{ fontSize: 30 }} type="danger"> {ticket.numero}</Text>
            </Col>
          </Row>
        )
      }
      {contextHolder}
      {/* <Modal visible={isModalVisible} onOk={handleOk}>
        <p>Favor de seleccionar la ventanilla primero</p>
      </Modal> */}
    </>
  )
}
