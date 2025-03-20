import { Button, Col, Form, Row, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { callFetchTypeById } from '@/config/api'; 

const SearchClient = () => {
    const [form] = Form.useForm();
    const [product, setProduct] = useState<any>(null);

    const onFinish = async (values: any) => {
        if (!values.productId) {
            message.warning('Vui lòng nhập ID sản phẩm!');
            return;
        }

        try {
            const response = await callFetchTypeById(values.productId);
            if (response.data) {
                setProduct(response.data);
                message.success('Tìm thấy sản phẩm!');
            } else {
                message.error('Không tìm thấy sản phẩm!');
            }
        } catch (error) {
            message.error('Lỗi khi tìm kiếm sản phẩm!');
        }
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <h2>Tìm kiếm sản phẩm</h2>
                </Col>
                <Col span={16}>
                    <Form.Item name='productId'>
                        <Input
                            placeholder='Nhập sản phẩm cần tìm...'
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Button type='primary' onClick={() => form.submit()}>
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>

            {/* Hiển thị thông tin sản phẩm nếu tìm thấy */}
            {product && (
                <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
                    <Col span={24}>
                        <h3>Thông tin sản phẩm:</h3>
                        <p>
                            <strong>ID:</strong> {product.id}
                        </p>
                        <p>
                            <strong>Tên:</strong> {product.name}
                        </p>
                        <p>
                            <strong>Mô tả:</strong> {product.description}
                        </p>
                    </Col>
                </Row>
            )}
        </Form>
    );
};

export default SearchClient;
