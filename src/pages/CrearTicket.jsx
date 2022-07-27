import React, { useContext, useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Typography, Button, Select, Image, Modal, Input, Radio, Divider  } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'; //CloseOutlined
import { useHideMenu } from '../hooks/useHideMenu';
import { SocketContext } from '../context/SocketContext';
import logoPng from '../static/logo.png';

const { Title, Text } = Typography;
const { Option } = Select;

// Bandera de validacion si selecciona ventanilla
var valor = 0;

const config = {
  title: 'Tickes - IMA',
  content: (
    <>
      <p>Favor de seleccionar la ventanilla primero</p>
    </>
  ),
};

// const initialState = {
//   name: '',
// };

export const CrearTicket = () => {

  useHideMenu(true);

  const { socket } = useContext(SocketContext);
  const [ticket, setTicket] = useState(null) ;
  const [escritorios,setEscritorios] = useState([]);
  const [juridicos,setJuridicos] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const [name, setName] = useState("");
  const [radiov, setRadiov] = useState(0);

  useEffect(() => {
    listEscritorios()
    listJuridico()
    // eslint-disable-next-line 
  }, [])

  // state = {
  //   checked: true,
  //   disabled: false,
  // };

  // const resetState = () => {
  //   setName(initialState);
  // };

  const listEscritorios = async() => {
    const respuesta = await Axios.get('https://glacial-tor-72395.herokuapp.com/api/escritorio/list');
    const data = respuesta.data;
    setEscritorios(data.rows);
  }

  const listJuridico = async() => {
    const respuesta = await Axios.get('https://glacial-tor-72395.herokuapp.com/api/juridicos/list');
    const data = respuesta.data;
    setJuridicos(data.rows);
  }

  // const listJuridico = async() => {
  //   const respuesta = await Axios.get('http://localhost:3009/api/juridicos/list');
  //   const data = respuesta.data;
  //   setJuridicos(data.rows);
  // }

  const nuevoTicket = () => {
    // e.preventDefault();
    if(valor !== 0 ) {
      // console.log(name);
      socket.emit('solicitar-ticket', { valor,name,radiov }, (ticket) => {
        setTicket(ticket);
        // window.location.reload();
        // setName("");
        // resetState();
      });
    } else {
      modal.info(config);
    }
  }

  function handleChange(value) {
    valor = value;
  }

  const onChange = e => {
    // console.log('radio checked', e.target.value);
    setRadiov(e.target.value);
  };

  return (
    <>
      <Row>
        <Col span={14} offset={6} align="center" >
          <Image
            preview={false}
            width={200}
            src={ logoPng }
          />
          <Title level={3}>Bienvenidos al IMA</Title>
          <Text>Crear Ticket</Text>
        </Col>
      </Row>
      <Divider/>
      <Row>
        <Col span={14} offset={6} align="center">
          <Title level={4}>Donde realizara su tramite</Title><br/>
          <Radio.Group name="radiogroup" onChange={onChange} value={radiov}>
            <Radio value={0}>Ventanilla</Radio>
            <Radio value={1}>Juridico</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <br/><br/>
      <Row>
        <Col span={14} offset={6} align="center"> 
          <Input 
            style={{ width: 300 }}
            placeholder="Nombre Apellido -> ej. Clark Kent"
            onChange={(e) => setName(e.target.value)}
            allowClear
          />
        </Col>
      </Row>
      <br/><br/><br/>
      {
        radiov === 0 ?
          <Row>
            <Col span={14} offset={6} align="center">
              <Select
                style={{ width: 300 }}
                placeholder="Seleccione ventanilla"
                onChange={handleChange}
              >
                {escritorios.map(item => (
                  <Option key={item.numero}>{item.descripcion}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        :
          <Row>
            <Col span={14} offset={6} align="center">
            <Select
              style={{ width: 300 }}
              onChange={handleChange}
            >
              {juridicos.map(item => (
                <Option key={item.numero} >{item.descripcion}</Option>
              ))}
            </Select>
              {/* <Select
                style={{ width: 300 }}
                placeholder="Seleccione escritorio juridico"
              >
                {juridicos.map(item => (
                  <Option key={item.numero}>{item.licenciado}</Option>
                ))}
              </Select> */}
            </Col>
          </Row>
      }
      <br/><br/><br/><br/><br/><br/>
      <Row>
        <Col span={14} offset={6} align="center">
          <Button type="primary" shape="round" icon={ <DownloadOutlined /> } size="large" onClick={ nuevoTicket }>
            Nuevo Ticket
          </Button>
        </Col>
      </Row>
      {
        ticket && (
          <Row style={{ marginTop: 100 }}>
            <Col span={ 14 } offset={ 6 } align="center">
              <Text level={2}>
                Su número
              </Text>
              <br/>
              <Text type="success" style={{ fontSize: 55 }}>
                {ticket.numero}
              </Text>
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
