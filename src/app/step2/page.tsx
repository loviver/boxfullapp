'use client'

import Image from "next/image";
import moment from 'moment';
import { useRouter } from 'next/navigation'
import axios from 'axios';

import "./page.css"

import { Button, Select, Form, Row, Col, Input, message, DatePicker } from 'antd';

import { PlusOutlined, DeleteFilled } from "@ant-design/icons";
import { useState } from "react";

import NumberInput from "@/components/NumberInput";

interface Bulto {
    largo: number;
    ancho: number;
    alto: number;
    pesoLB: number;
    contenido: string;
}

export default function Page(/*{ params }: { params: { id: number } }*/) {
    const router = useRouter();

    const [form] = Form.useForm();

    const [bultos, setBultos] = useState<Bulto[]>([]);

    const onFinish = async (values: any) => {
       
        setBultos([...bultos, {
            ...values,
            largo: parseFloat(values.largo),
            alto: parseFloat(values.alto),
            ancho: parseFloat(values.ancho),
            pesoLB: parseFloat(values.pesoLB)
        }]);

        form.resetFields();
    };

    const onFinishOrder = async (values: any) => {

        var storedParsedData = null;

        const storedData = localStorage.getItem('formData');
        if (storedData) {
            storedParsedData = JSON.parse(storedData);
        }

        // Si por alguna razon se limpio la informacion de cache de la pagina, detectar que no hay datos para enviar y que vuelva a llenarlos
        if(storedParsedData === null) {
            return router.push('/step1');
        }

        const formData = {...storedParsedData};

        // Agregar prefijo al telefono para enviar completo ejemplo: +503 75731028
        if(formData.telefono !== undefined) {
            formData.telefono = `+${formData.prefixNumber} ${formData.telefono}`;

            delete formData.prefixNumber;
        }

        // Para enviar fecha en formato adecuado....
        if(formData.fecha_programada !== undefined) {
            formData.fecha_programada = moment(formData.fecha_programada).format('YYYY/MM/DD')
        }

        if(bultos.length < 1) {
            return message.error('Debe agregar al menos un bulto!');
        }

        bultos.map((v) => {
            if(formData.bultos === undefined) {
                formData.bultos = [];
            }

            formData.bultos.push(v);
        });

        try {
            const response = await axios.post('http://localhost:3100/ordenes/crear', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
     
            message.success('Orden guardada correctamente!');

            localStorage.removeItem('formData');
            router.push('/step1');
        } catch (error) {

            message.error('Error al enviar el formulario. Por favor, intenta de nuevo más tarde.');
        }
    };

    const onFinishFailed = async (values: any) => {
        let errores = values.errorFields;

        // siempre mostrar un error para que la interfaz sea dinamica y muestre estos errores en una forma mas elegante y comoda por la interfaz
        message.error(errores[0].errors.join(', '));
    };

    return (
        <main className="lg:w-[60%] lg:min-w-[1000px] flex-col mx-auto my-5">
            <div className="my-10 lg:px-0 px-5">
                <div className="text-2xl font-[600] text-[#4D5568]">Crea una orden</div>
                <div className="text-[#7682A0]">
                    Dale una ventaja competitiva a tu negocio con entregas el mismo día  (Área Metropolitana) y el día siguiente a nivel nacional.
                </div>
            </div>

            <div className="rounded-[10px] bg-[#FFFFFF] shadow-lg border px-5 py-12 w-full">
                
                <div className="flex flex-col gap-4 mb-5">
                    <div>
                        <div className="font-medium">Agrega tus bultos</div>
                        <div className="mt-2 bg-[#F3F5F9] border rounded-[5px] px-3 py-5 w-full min-h-[50px]">
                            <Form
                                layout="vertical"
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                form={form}
                            >
                                <Row gutter={0} align="middle" className="seccionMedidas">
                                    
                                    <Col xs={24} md={2}>
                                        <div className="flex items-center justify-center w-full">
                                            <Image
                                                src="/icons/Frame.png"
                                                width={32}
                                                height={32}
                                            >
                                            </Image>
                                        </div>
                                    </Col>

                                    <Col xs={24} md={3} className="colMedida">
                                        <Form.Item 
                                            label="Largo"
                                            name="largo"
                                            rules={[{
                                                required: true,
                                                message: "Debe especificar el largo"
                                            }]}
                                            validateStatus={''}
                                            help={''}
                                        >
                                            <NumberInput size="large" className="InputInicial" addonAfter="cm"/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={3} className="colMedida">
                                        <Form.Item 
                                            label="Alto"
                                            name="alto"
                                            rules={[{
                                                required: true,
                                                message: "Debe especificar el alto"
                                            }]}
                                            validateStatus={''}
                                            help={''}
                                        >
                                            <NumberInput size="large" className="InputMedio" addonAfter="cm"/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={3} className="colMedida">
                                        <Form.Item 
                                            label="Ancho"
                                            name="ancho"
                                            rules={[{
                                                required: true,
                                                message: "Debe especificar el ancho"
                                            }]}
                                            validateStatus={''}
                                            help={''}
                                        >
                                            <NumberInput size="large" className="InputFinal" addonAfter="cm"/>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={23} offset="1" md={3}>
                                        <Form.Item 
                                            label="Peso en Libras"
                                            name="pesoLB"
                                            rules={[{
                                                required: true,
                                                message: "Debe especificar el peso"
                                            }]}
                                            validateStatus={''}
                                            help={''}
                                        >
                                            <NumberInput size="large"/>
                                        </Form.Item>
                                    </Col>
                                    
                                    <Col xs={23} offset="1" md={8}>
                                        <Form.Item 
                                            label="Contenido"
                                            name="contenido"
                                            rules={[{
                                                required: true,
                                                message: "Debe especificar el contenido"
                                            }]}
                                            validateStatus={''}
                                            help={''}
                                        >
                                            <Input size="large"/>
                                        </Form.Item>
                                    </Col>

                                </Row>

                                <Form.Item wrapperCol={{
                                    sm: {
                                        offset: 20, span: 4
                                    },
                                    xs: {
                                        offset: 16, span: 8
                                    }
                                }}>
                                    <Button size="large" className="w-full" htmlType="submit">
                                        Enviar <PlusOutlined />
                                    </Button>    
                                </Form.Item>
                            </Form>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-col">
                        <div className="font-medium">Agrega tus bultos</div>
                        <div className="border border-[#3EBF5B] w-full min-h-[70px] rounded-[10px] px-2 py-3">
                        
                            {bultos.map((bulto, index) => (
                                <Form layout="vertical" key={index}>
                                    <Row gutter={0} align="middle" className="seccionMedidas">
                                        
                                        <Col xs={24} md={4}>
                                            <Form.Item 
                                                label="Peso en Libras"
                                                name="pesoLB"
                                            >
                                                <NumberInput defaultValue={bultos[index].pesoLB} onChange={(value) => {
                                                    setBultos((prevBultos) => {
                                                        const updatedBultos = [...prevBultos];
                                                        updatedBultos[index].pesoLB = parseFloat(value);
                                                        return updatedBultos;
                                                    });
                                                }} size="large"/>
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col xs={23} offset="1" md={11}>
                                            <Form.Item 
                                                label="Contenido"
                                                name="contenido"
                                            >
                                                <Input defaultValue={bultos[index].contenido} onChange={(value) => {
                                                    setBultos((prevBultos) => {
                                                        const updatedBultos = [...prevBultos];
                                                        updatedBultos[index].contenido = value;
                                                        return updatedBultos;
                                                    });
                                                }}size="large"/>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={2}>
                                            <div className="flex items-center justify-center w-full">
                                                <Image
                                                    src="/icons/Frame.png"
                                                    width={32}
                                                    height={32}
                                                >
                                                </Image>
                                            </div>
                                        </Col>

                                        <Col xs={24} md={2} className="colMedida">
                                            <Form.Item 
                                                label="Largo"
                                                name="largo"
                                            >
                                                <NumberInput defaultValue={bultos[index].largo} onChange={(value) => {
                                                    setBultos((prevBultos) => {
                                                        const updatedBultos = [...prevBultos];
                                                        updatedBultos[index].pesoLB = parseFloat(value);
                                                        return updatedBultos;
                                                    });
                                                }} size="large" className="InputInicial" addonAfter="cm"/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={2} className="colMedida">
                                            <Form.Item 
                                                label="Alto"
                                                name="alto"
                                            >
                                                <NumberInput defaultValue={bultos[index].alto} onChange={(value) => {
                                                    setBultos((prevBultos) => {
                                                        const updatedBultos = [...prevBultos];
                                                        updatedBultos[index].pesoLB = parseFloat(value);
                                                        return updatedBultos;
                                                    });
                                                }} size="large" className="InputMedio" addonAfter="cm"/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={2} className="colMedida">
                                            <Form.Item 
                                                label="Ancho"
                                                name="ancho"
                                            >
                                                <NumberInput defaultValue={bultos[index].ancho} onChange={(value) => {
                                                    setBultos((prevBultos) => {
                                                        const updatedBultos = [...prevBultos];
                                                        updatedBultos[index].pesoLB = parseFloat(value);
                                                        return updatedBultos;
                                                    });
                                                }} size="large" className="InputFinal" addonAfter="cm"/>
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Form.Item wrapperCol={{
                                        sm: {
                                            offset: 23, span: 1
                                        },
                                        xs: {
                                            offset: 16, span: 8
                                        }
                                    }}>
                                        <Button size="large" className="w-full" type="transparent" onClick={() => {
                                            setBultos((prevBultos) => {
                                                const updatedBultos = [...prevBultos];

                                                delete updatedBultos[index];

                                                return updatedBultos;
                                            });
                                        }}>
                                            <DeleteFilled style={{ color: 'red', fontSize: 25 }}/>
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-row justify-between mt-4">
                    <Button size="large" onClick={() => {
                        router.back();
                    }}>
                        Regresar
                    </Button>

                    <Button size="large" type="primary" onClick={onFinishOrder}>
                        Siguiente
                    </Button>
                </div>

            </div>
        </main>
    );
}
