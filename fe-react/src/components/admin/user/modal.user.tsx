import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchType, callFetchRole, callUpdateUser } from "@/config/api";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "./debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface ITypeSelect {
    label: string;
    value: string;
    key?: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [types, setTypes] = useState<ITypeSelect[]>([]);
    const [roles, setRoles] = useState<ITypeSelect[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id) {
            if (dataInit.role) {
                setRoles([
                    {
                        label: dataInit.role?.name,
                        value: dataInit.role?._id,
                        key: dataInit.role?._id,
                    }
                ])
            }
        }
    }, [dataInit]);

    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, age, gender, role, type } = valuesForm;
        if (dataInit?._id) {
            //update
            const user = {
                name,
                email,
                password,
             
                role: role?.value ?? role._id,
               
            }

            const res = await callUpdateUser(user, dataInit._id);
            if (res.data) {
                message.success("Cập nhật user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const user = {
                name,
                email,
                password,
               
                role: role.value,
               
            }
            const res = await callCreateUser(user);
            if (res.data) {
                message.success("Thêm mới user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setTypes([]);
        setRoles([]);
        setOpenModal(false);
    }

    // Usage of DebounceSelect

    async function fetchRoleList(name: string): Promise<ITypeSelect[]> {
        const res = await callFetchRole(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?._id ? "Cập nhật User" : "Tạo mới User"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
                initialValues={dataInit?._id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                            placeholder="Nhập email"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={dataInit?._id ? true : false}
                            label="Password"
                            name="password"
                            rules={[{ required: dataInit?._id ? false : true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập password"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                        />
                    </Col>
                    {/* <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormDigit
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập nhập tuổi"
                        />
                    </Col> */}
                    {/* <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormSelect
                            name="gender"
                            label="Giới Tính"
                            valueEnum={{
                                MALE: 'Nam',
                                FEMALE: 'Nữ',
                                OTHER: 'Khác',
                            }}
                            placeholder="Please select a gender"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        />
                    </Col> */}
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}

                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={roles}
                                value={roles}
                                placeholder="Chọn vai trò"
                                fetchOptions={fetchRoleList}
                                onChange={(newValue: any) => {
                                    if (newValue?.length === 0 || newValue?.length === 1) {
                                        setRoles(newValue as ITypeSelect[]);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>
                  
                  
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalUser;
