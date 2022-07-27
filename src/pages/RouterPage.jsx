import React, { useContext } from 'react'
import { Layout, Menu } from 'antd';
import {
    UserAddOutlined,
    TableOutlined,
    FileAddOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link
} from "react-router-dom";
import { Ingresar } from './Ingresar';
import { Cola } from './Cola';
import { CrearTicket } from './CrearTicket';
import { Escritorio } from './Escritorio';
import { DeshabilitarEsc } from './DeshabilitarEsc';
import { UiContext } from '../context/UiContext';

const { Sider, Content } = Layout;

export const RouterPage = () => {
    const { ocultarMenu } = useContext(UiContext)
    return (
        <BrowserRouter>
            <Layout style={{ height: '100vh' }}>
                <Sider 
                    collapsedWidth="0"
                    breakpoint="md" 
                    hidden={ ocultarMenu }
                >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<UserAddOutlined />}>
                            <Link to="./ingresar">
                                Ingresar
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<CloseCircleOutlined />}>
                            <Link to="./deshabilitar">
                                Deshabilitar Escritorio
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<TableOutlined />}>
                            <Link to="./cola">
                                Cola de Tickets
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<FileAddOutlined />}>
                            <Link to="./crear">
                                Crear Ticket
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Content
                        className="site-layout-background"
                        style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        }}
                    >
                        <Routes>
                            <Route path="/ingresar" element={ <Ingresar /> }/>
                            <Route path="/cola" element={ <Cola /> }/>
                            <Route path="/crear" element={ <CrearTicket /> }/>
                            <Route path="/deshabilitar" element={ <DeshabilitarEsc /> }/>
                            <Route path="/escritorio" element={ <Escritorio /> }/>
                            <Route path="*" element={ <Navigate replace to="/ingresar" /> } />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </BrowserRouter>
    )
}
