import React, { useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Typography, List, Card, Tag, Divider, Image } from 'antd';
import { useHideMenu } from '../hooks/useHideMenu';
import { SocketContext } from '../context/SocketContext';
import { getUltimos } from '../helpers/getUltimos';
// import Item from 'antd/lib/list/Item';
// import { DownloadOutlined } from '@ant-design/icons';

import logoPng from '../static/logo.png';

const { Title, Text } = Typography;

export const Cola = () => {

  useHideMenu(true);

  const { socket } = useContext(SocketContext);

  const [tickets, setTickets] = useState([]);
  const [nombre, setNombre] = useState('[]');
  // const [agent,setAgent] = useState('[]');

  useEffect(() => {
    socket.on('ticket-asignado', (asignados) =>{
      if(asignados){
          nombreTicket(asignados[0].numero,asignados[0].escritorio); 
          // get nombre agente
          // agenteTicket(asignados[0].numero,asignados[0].agente,asignados[0].escritorio);
          // const texto = "Ticket " + ticket.numero + " pasar a ventanilla " + ticket.escritorio;
          // const texto = "Ticket " + asignados[0].numero + " pasar a ventanilla " + asignados[0].escritorio;
          const texto = nombre + " favor de pasar a ventanilla " + asignados[0].escritorio;
          speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
          setTickets(asignados)
      }
    });
    return () => {
      socket.off('ticket-asignado');
    }
  }, [socket,nombre])

  useEffect(() => {
    getUltimos().then( tickets => setTickets(tickets) );
  }, []);

  // Get Nombre Ticket x ventanilla
  const nombreTicket = async(t,esc) => {
    // Traer nombre Ticket
    // console.log(selectionType.selectionType[0].ticket);
    const respuesta = await Axios.get('https://glacial-tor-72395.herokuapp.com/api/ticket/nombre/',{
      params:{
        'ticket': t,
        'escritorio': esc
      }
    });
    const dataNom = respuesta.data.rows;
    setNombre(dataNom);
  }
  
  // // get nombre agente
  // const agenteTicket = async(t,a,esc) =>{
  //   const resp = await Axios.get('http://localhost:3009/api/ticket/agente/',{
  //     params:{
  //       'ticket': t,
  //       'numEmpleado': a,
  //       'escritorio': esc
  //     }
  //   });
    
  //   const datas = resp.data.rows;
  //   jur = resp.data.j;
  //   if(jur === 1){
  //     datas.forEach(function(item) {
  //       console.log('1');
  //       setAgent(item.licenciado);
  //     });
  //   }else{
  //     console.log(datas);
  //     datas.forEach(function(item) {
  //       console.log('2');
  //       setAgent(item.descripcion);
  //     });
  //   }
  // }

  return (
    <>
      <Image
        preview={false}
        width={200}
        src={ logoPng }
      />
      <Title level={1}>Turnos de espera</Title>
      <Divider/>
      <Row>
        <Col span={12}>
          <List 
            dataSource={ tickets.slice(0,3) } 
            renderItem={ item => (
              <List.Item>
                <Card 
                  style={{width: 300, margintop: 16}} 
                  actions={[
                    // <Tag color="success"> {agent}</Tag>,
                    <Tag color="success"> {item.agente}</Tag>,
                    <Tag color="gold">Ticket: {item.numero}</Tag>
                  ]}>
                  <Title>Escritorio: {item.escritorio}</Title>
                  <Title level={5}>{item.nombre}</Title>
                </Card>
              </List.Item>
            )}
          />
        </Col>

        <Col span={12}>
          <Divider> Historial </Divider>
          <List
            dataSource={ tickets.slice(3) }
            renderItem={ item => (
              <List.Item>
                <List.Item.Meta
                  title={`Ticket No. ${ item.numero}`}
                  description={
                    <>
                      <Text type="secondary">En el Escritorio: </Text>
                      <Tag color="gold"> { item.numero } </Tag>
                      <Text type="secondary"> Atendiendo a: </Text>
                      <Tag color="success"> { item.nombre } </Tag>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  )
}
