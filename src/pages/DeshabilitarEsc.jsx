import React, { useState } from 'react';
import Axios from 'axios';
import { Row, Col, Button, Typography, Divider, InputNumber, Image } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHideMenu } from '../hooks/useHideMenu';

import logoPng from '../static/logo.png';

const { Title, Text } = Typography;

// Bandera de validacion si selecciona ventanilla
// var valor = 0;

export const DeshabilitarEsc = () => {
    useHideMenu(false);

    const [currentValue, setCurrentValue] = useState(0)

    const deshabilitarEsc = async() => {
        Axios.put('https://glacial-tor-72395.herokuapp.com/api/escritorio/deshabilitar/'+ currentValue);
        // console.log(respuesta.data.rows); 
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
            <Title level={2}> Deshabilitar Escritorio</Title>
            <Text type="danger">* Solo aplica para juridico</Text>
            <Divider/>
            
            <Row>
                <Col offset={2} span={22} align="left">
                    <Text>Numero de empleado: </Text>
                    <InputNumber min={0} onChange={(value) => { setCurrentValue(value) }} />
                </Col>
            </Row>
            <br/>
            <Row>
                <Col offset={2} span={22} align="left">
                    <Button onClick={ deshabilitarEsc }  type="danger" shape='round'>
                        <CloseOutlined />
                        Deshabilitar
                    </Button>
                </Col>
            </Row>
        </>
    );
}
