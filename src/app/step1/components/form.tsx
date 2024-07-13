'use client'

import { useRouter } from 'next/navigation'
import Image from "next/image";
import { useEffect, useState } from "react";
import moment from 'moment';
import axios from 'axios';

import { Button, Select, Form, Row, Col, Input, message, DatePicker } from 'antd';
import { ArrowRightOutlined } from "@ant-design/icons";

import en from "antd/es/date-picker/locale/en_US";

type TipeoCampos = {
    direccion_recoleccion?: String;
    fecha_programada?: string | any;
    nombres?: string;
    apellidos?: string;
    email?: string;
    telefono?: string;
    direccion_destinatario?: string;
    departamento?: string;
    municipio?: string;
    complemento?: string;
    indicaciones?: string;
    
    prefixNumber?: string;
};

interface Errores {
    name: string;
    errors: string;
};

const direccionesEjemplos = [
    "Plaza Salvador del Mundo, San Salvador",
    "Centro Histórico de Suchitoto, Suchitoto",
    "Ruta de las Flores, Departamento de Ahuachapán",
    "Parque Nacional El Boquerón, San Salvador",
    "Colonia Las Magnolias Calle ruta militar #1, San Miguel, San Miguel."
];

/*
    Para que los datepicker puedan tener un formato local dia / mes / anio, y evitar confusiones a clientes
*/
const buddhistLocale: typeof en = {
    ...en,
    lang: {
        ...en.lang,
        fieldDateFormat: 'DD/MM/YYYY',
        fieldDateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
        yearFormat: 'YYYY',
        cellYearFormat: 'YYYY',
    },
};

export default function FormOrden() {
    const router = useRouter();

    const [form] = Form.useForm()

    const [initialForm, setInitialForm] = useState<any>({
        direccion_recoleccion: "",
        fecha_programada: moment(),
        nombres: "",
        apellidos: "",
        email: "",
        telefono: "",
        direccion_destinatario: "",
        departamento: "",
        municipio: "",
        complemento: "",
        indicaciones: "",
        prefixNumber: "503"
    });

    const [prefixNumber, setPrefixNumber] = useState<string>(initialForm.prefixNumber);
    const [errors, setErrors] = useState<Errores[]>([]);

    // Para cargar la info desde el cache hasta que finalice el formulario totalmente
    useEffect(() => {
        const storedData = localStorage.getItem('formData');
        if (storedData) {
            const storedParsedData = JSON.parse(storedData);

            storedParsedData.fecha_programada = moment(storedParsedData.fecha_programada, "YYYY-MM-DD");

            setPrefixNumber(storedParsedData.prefixNumber);

            form.setFieldsValue(storedParsedData);
        }
        else {
            form.setFieldsValue(initialForm);
        }
    }, [])

    /*
        Logia para cuando el formulario se termine
    */
    const onFinish = async (values: any) => {

        // clonar objeto values, por alguna razon se hace retroactivo si no lo seteo asi .
        const formData = {...values};

        // Agregar prefijo al telefono para enviar completo ejemplo: +503 75731028
        if(formData.telefono !== undefined) {
            formData.telefono = `+${prefixNumber} ${formData.telefono}`;
        }

        // Para enviar fecha en formato adecuado....
        if(formData.fecha_programada !== undefined) {
            formData.fecha_programada = moment(formData.fecha_programada).format('YYYY/MM/DD')
        }

        try {
            const response = await axios.post('http://localhost:3100/ordenes/validar', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
     
            let saveData = {...values, prefixNumber: prefixNumber};

            // 
            console.log(saveData);
            
            // guardar cache
            localStorage.setItem('formData', JSON.stringify(saveData));

            router.push('/step2');
    
            message.success('Información correcta!');
        } catch (error) {
            setErrors(error.response.data.message);

            //message.error('Error al enviar el formulario. Por favor, intenta de nuevo más tarde.');

        }
    };

    const onFinishFailed = async (values: any) => {
        // Con este logica, podremos simular las validaciones backend para que exista doble validacion ..
        // La validacion frontend le dira al cliente de forma mas bonita "que debe hacer", 
        // Mientras que la backend sigue activa para ser mas especifica en caso lo amerite
        
        // He dejado una validacion frontend para el campo de "Direccion de recoleccion" solamente, para que se reflejen backend las otras a forma de ejemplo para la prueba tecnica!
        let reformed: Errores[] = [];

        values.errorFields.forEach((v: any) => {
            
            const val: any = {};

            val.name = v.name[0];
            val.errors = v.errors;

            reformed.push(val);
        });

        setErrors(reformed);
    };

    const refrescarError = (campo: string) => {
        const removerError = errors.findIndex(error => error.name === campo);
        if(removerError !== -1) {
            let nuevosErrores = [...errors];
            nuevosErrores.splice(removerError, 1);
            setErrors(nuevosErrores);
        }
    };

    /*
        Componente para prefijo de telefono, para solo llamarlo desde el atributo append para el campo telefono
    */
    const prefijoTelefono = (
        <Select
            defaultValue="503"
            value={prefixNumber}
            onChange={function(value: string) {
                setPrefixNumber(value);
            }}
            style={{
                width: 70,
            }}
        >
            <Select.Option value={"503"}>
                <Image alt="sv flag" src="/flags/sv.png" width={24} height={24}></Image>
            </Select.Option>
            <Select.Option value={"1"}>
                <Image alt="eu flag" src="/flags/eu.svg" width={24} height={24}></Image>
            </Select.Option>
        </Select>
    );

    return (
        <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
        >
            <Row gutter={24}>
                <Col xs={24} sm={15}>
                    <Form.Item
                        label="📍 Dirección de recolección"
                        name="direccion_recoleccion"
                        autoComplete="off"
                        rules={[
                            { required: true, message: "Debe completar el campo"}
                        ]}
                        validateStatus={errors.find(error => error.name === 'direccion_recoleccion') ? 'error' : ''}
                        help={errors.find(error => error.name === 'direccion_recoleccion') ? errors.find(error => error.name === 'direccion_recoleccion').errors.join(', ') : ''}
                    >
                        <Select
                            onChange={() => refrescarError('direccion_recoleccion')}
                            style={{ width: '100%' }}
                            size="large"
                            options={direccionesEjemplos.map(direccion => ({
                                value: direccion,
                                label: direccion
                            }))}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={9}>
                    <Form.Item
                        label="📅 Fecha Programada"
                        name="fecha_programada"
                        autoComplete="off"
                        validateStatus={errors.find(error => error.name === 'fecha_programada') ? 'error' : ''}
                        help={errors.find(error => error.name === 'fecha_programada') ? errors.find(error => error.name === 'fecha_programada').errors.join(', ') : ''}
                        onChange={() => refrescarError('fecha_programada')}
                    >
                        <DatePicker
                            onChange={() => refrescarError('fecha_programada')}
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="Seleccione Fecha"
                            locale={buddhistLocale}
                        ></DatePicker>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={12} sm={8}>
                    <Form.Item
                        label="Nombres"
                        name="nombres"
                        validateStatus={errors.find(error => error.name === 'nombres') ? 'error' : ''}
                        help={errors.find(error => error.name === 'nombres') ? errors.find(error => error.name === 'nombres').errors.join(', ') : ''}
                        onChange={() => refrescarError('nombres')}
                    >
                        <Input size="large">
                        </Input>
                    </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                    <Form.Item
                        label="Apellidos"
                        name="apellidos"
                        validateStatus={errors.find(error => error.name === 'apellidos') ? 'error' : ''}
                        help={errors.find(error => error.name === 'apellidos') ? errors.find(error => error.name === 'apellidos').errors.join(', ') : ''}
                        onChange={() => refrescarError('apellidos')}
                    >   
                        <Input size="large">
                        </Input>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item
                        label="Correo Electrónico"
                        name="email"
                        validateStatus={errors.find(error => error.name === 'email') ? 'error' : ''}
                        help={errors.find(error => error.name === 'email') ? errors.find(error => error.name === 'email').errors.join(', ') : ''}
                        onChange={() => refrescarError('email')}
                    >
                        <Input size="large">
                        </Input>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col xs={24} sm={8}>
                    <Form.Item
                        label="Teléfono"
                        name="telefono"
                        validateStatus={errors.find(error => error.name === 'telefono') ? 'error' : ''}
                        help={errors.find(error => error.name === 'telefono') ? errors.find(error => error.name === 'telefono').errors.join(', ') : ''}
                        onChange={() => refrescarError('telefono')}
                    >
                        <Input size="large" style={{ width: '100%' }} prefix={`+${prefixNumber}`} addonBefore={prefijoTelefono}/>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={16}>
                    <div className="flex flex-row gap-2">
                        <div className='flex items-center'>
                            <Image 
                                alt="gps"
                                src="/icons/gps.png"
                                width={32}
                                height={32}
                            >
                            </Image>
                            
                        </div>
                        <Form.Item
                            label="Direccion del destinatario"
                            name="direccion_destinatario"
                            className='w-full'
                            validateStatus={errors.find(error => error.name === 'direccion_destinatario') ? 'error' : ''}
                            help={errors.find(error => error.name === 'direccion_destinatario') ? errors.find(error => error.name === 'direccion_destinatario').errors.join(', ') : ''}
                            onChange={() => refrescarError('direccion_destinatario')}
                        >
                            <Input size="large"></Input>
                        </Form.Item>
                    </div>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col xs={24} sm={8}>
                    <Form.Item 
                        label="Departamento"
                        name="departamento"
                        autoComplete="off"
                        validateStatus={errors.find(error => error.name === 'departamento') ? 'error' : ''}
                        help={errors.find(error => error.name === 'departamento') ? errors.find(error => error.name === 'departamento').errors.join(', ') : ''}
                        
                    >
                        <Select
                            onChange={() => refrescarError('departamento')}
                            style={{ width: '100%' }}
                            size="large"
                            options={[
                                { value: '01', label: 'Ahuachapán' },
                                { value: '02', label: 'Santa Ana' },
                                { value: '03', label: 'Sonsonate' },
                                { value: '04', label: 'Chalatenango' },
                                { value: '05', label: 'La Libertad' },
                                { value: '06', label: 'San Salvador' },
                                { value: '07', label: 'Cuscatlán' },
                                { value: '08', label: 'La Paz' },
                                { value: '09', label: 'Cabañas' },
                                { value: '10', label: 'San Vicente' },
                                { value: '11', label: 'Usulután' },
                                { value: '12', label: 'San Miguel' },
                                { value: '13', label: 'Morazán' },
                                { value: '14', label: 'La Unión' }
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item 
                        label="Municipio"
                        name="municipio"
                        autoComplete="off"
                        validateStatus={errors.find(error => error.name === 'municipio') ? 'error' : ''}
                        help={errors.find(error => error.name === 'municipio') ? errors.find(error => error.name === 'municipio').errors.join(', ') : ''}
                    >
                        <Select
                            onChange={() => refrescarError('municipio')}
                            style={{ width: '100%' }}
                            size="large"
                            options={[
                                { value: '01', label: 'Ahuachapán' },
                                { value: '02', label: 'Apaneca' },
                                { value: '03', label: 'Atiquizaya' },
                                { value: '04', label: 'Concepcion de Ataco' },
                                { value: '05', label: 'El Refugio' },
                                { value: '06', label: 'Guaymango' },
                                { value: '07', label: 'Jujutla' },
                                { value: '08', label: 'San Francisco Menendez' },
                                { value: '09', label: 'San Lorenzo' },
                                { value: '10', label: 'Sna Pedro Puxtla' },
                                { value: '11', label: 'San Salvador' }
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item
                        label="Punto de Referencia"
                        name="complemento"
                        validateStatus={errors.find(error => error.name === 'complemento') ? 'error' : ''}
                        help={errors.find(error => error.name === 'complemento') ? errors.find(error => error.name === 'complemento').errors.join(', ') : ''}
                        onChange={() => refrescarError('complemento')}
                    >
                        <Input size="large"></Input>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24}>
                    <Form.Item
                        label="Indicaciones"
                        name="indicaciones"
                        validateStatus={errors.find(error => error.name === 'indicaciones') ? 'error' : ''}
                        help={errors.find(error => error.name === 'indicaciones') ? errors.find(error => error.name === 'indicaciones').errors.join(', ') : ''}
                        onChange={() => refrescarError('indicaciones')}
                    >
                        <Input size="large"></Input>
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
                <Button size="large" type="primary" className="w-full" htmlType="submit">
                    Siguiente <ArrowRightOutlined />
                </Button>
            </Form.Item>
        </Form>
    );
}