import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Form, Button, Typography, Divider, Select, InputNumber, Image, Radio } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Navigate, useNavigate  } from 'react-router-dom';
import { useHideMenu } from '../hooks/useHideMenu';
import { getUsuarioStorage } from '../helpers/getUsuarioStorage';

import logoPng from '../static/logo.png';

const { Title, Text } = Typography;
const { Option } = Select;

// Bandera de validacion si selecciona ventanilla
// var valor = 0;

export const Ingresar = () => {
  useHideMenu(false);

  const navigate = useNavigate ();
  const [usuario] = useState(getUsuarioStorage());
  const [escritorios,setEscritorios] = useState([]);
  const [juridicos,setJuridicos] = useState([]);
  const [radiov, setRadiov] = useState(0);

  useEffect(() => {
    listEscritorios()
    listJuridico()
    // eslint-disable-next-line 
  }, []);

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

  const onFinish = ({ numEmpleado, nombre, escritorio}) => {
    // Buscar en users el numEmpleado get nombre apellido paterno
    localStorage.setItem('numEmpleado', numEmpleado);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('escritorio', escritorio);
    localStorage.setItem('juridico', radiov);
    navigate('/escritorio');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChange = e => {
    // console.log('radio checked', e.target.value);
    setRadiov(e.target.value);
  };

  if (usuario.numEmpleado && usuario.escritorio && usuario.nombre){
    return <Navigate to="/escritorio" />
  }

  return (
    <>
      <Image
        preview={false}
        width={200}
        src={ logoPng }
      />
      <Title level={1}> Sistema de Tickets IMA</Title>
      <Divider/>
      <Title level={2}> Ingresar</Title>
      <Text >Favor de ingresar los datos solicitados</Text>
      <Divider/>
      <Form
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Numero de empleado"
          name="numEmpleado"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese su número de empleado',
            },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>

        {/* <Form.Item
          label="Nombre Empleado"
          name="nombre"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese su nombre',
            },
          ]}
          
        >
          <Input 
            placeholder="ej. Nombre Apellido -> Clark Kent"
          />
        </Form.Item> */}

      <Form.Item
          label="Tipo de escritorio"
          name="tipoescritorio"
      >
        {/* defaultValue={0} */}
        <Radio.Group name="radiogroup" onChange={onChange} value={radiov} >
          <Radio value={0}>Ventanilla</Radio>
          <Radio value={1}>Juridico</Radio>
        </Radio.Group>
      </Form.Item>

        <Form.Item
          label="Escritorio"
          name="escritorio"
          rules={[
            {
              required: true,
              message: 'Ingrese el numero de ventanilla',
            },
          ]}
        >
          {
            radiov === 0 ?
              <Select
                style={{ width: 300 }}
                placeholder="Seleccione ventanilla"
              >
                {escritorios.map(item => (
                  <Option key={item.numero}>{item.descripcion}</Option>
                ))}
              </Select>
            :
              <Select
                style={{ width: 300 }}
                placeholder="Seleccione escritorio juridico"
              >
                {juridicos.map(item => (
                  <Option key={item.numero}>Juridico</Option>
                ))}
              </Select>
          }
          
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" shape='round'>
            <UserOutlined />
            Ingresar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
