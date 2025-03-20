import { callFetchProduct } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { IProduct } from '@/types/backend';
import { DollarOutlined, SearchOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Empty,
    Input,
    message,
    Pagination,
    Row,
    Spin,
    Form,
} from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Import tiếng Việt

dayjs.extend(relativeTime);
dayjs.locale('vi'); // Đặt locale về tiếng Việt

interface IProps {
    showPagination?: boolean;
}

const ProductCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayProduct, setDisplayProduct] = useState<IProduct[] | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('sort=-updatedAt');
    const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
    const isHomePage = location.pathname === '/'; // Kiểm tra xem có phải trang chủ không
    const [form] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [current, pageSize, filter, sortQuery]);

    const fetchProduct = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchProduct(query);
        if (res && res.data) {
            setDisplayProduct(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleOnchangePage = (pagination: {
        current: number;
        pageSize: number;
    }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };
   const onFinish = async (values: any) => {
       if (!values.searchTerm) {
           message.warning('Vui lòng nhập từ khóa tìm kiếm!');
           return;
       }

       // Chỉ encode search term, không encode toàn bộ chuỗi query
       const encodedSearch = encodeURIComponent(values.searchTerm.trim());

       setFilter(`name=${encodedSearch}`);
   };
    const handleViewDetailProduct = (item: IProduct) => {
        const slug = convertSlug(item.name);
        navigate(`/product/${slug}?id=${item._id}`);
    };

    return (
        <div className={`${styles['card-product-section']}`}>
            <div className={`${styles['product-content']}`}>
                {!isHomePage && (
                    <div
                        className={styles['search-product-content']}
                        style={{
                            marginBottom: 50,
                            marginTop: 0,
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Form form={form} onFinish={onFinish} layout='inline'>
                            <Form.Item
                                style={{ width: '30vw' }}
                                name='searchTerm'
                            >
                                <Input
                                    placeholder='Tìm kiếm sản phẩm...'
                                    prefix={<SearchOutlined />}
                                />
                            </Form.Item>

                            <Button type='primary' htmlType='submit'>
                                Tìm kiếm
                            </Button>
                        </Form>
                    </div>
                )}

                <Spin spinning={isLoading} tip='Loading...'>
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div
                                className={
                                    isMobile
                                        ? styles['dflex-mobile']
                                        : styles['dflex-pc']
                                }
                            >
                                <span
                                    style={{
                                        fontSize: '27px',
                                        fontFamily: 'Arial',
                                    }}
                                >
                                    Các loại thức uống
                                </span>

                                {!showPagination && (
                                    <Link to='product'>Xem tất cả</Link>
                                )}
                            </div>
                        </Col>

                        {displayProduct?.map((item) => {
                            return (
                                <Col span={24} md={12} key={item._id}>
                                    <Card
                                        size='small'
                                        title={null}
                                        hoverable
                                        onClick={() =>
                                            handleViewDetailProduct(item)
                                        }
                                    >
                                        <div
                                            className={
                                                styles['card-product-content']
                                            }
                                        >
                                            <div
                                                className={
                                                    styles['card-product-left']
                                                }
                                            >
                                                <img
                                                    alt='example'
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_BACKEND_URL
                                                    }/images/product/${
                                                        item?.image
                                                    }`}
                                                />
                                            </div>
                                            <div
                                                className={
                                                    styles['card-product-right']
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles['product-title']
                                                    }
                                                >
                                                    {item.name}
                                                </div>

                                                <div>
                                                    <DollarOutlined
                                                        style={{
                                                            color: 'orange',
                                                        }}
                                                    />
                                                    &nbsp; Giá: &nbsp;
                                                    {(item.price + '')?.replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        ',',
                                                    )}{' '}
                                                    đ
                                                </div>
                                                <div
                                                    className={
                                                        styles[
                                                            'product-updatedAt'
                                                        ]
                                                    }
                                                >
                                                    Ngày ra mắt: &nbsp;
                                                    {dayjs(item.updatedAt)
                                                        .locale('vi')
                                                        .fromNow()}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}

                        {(!displayProduct ||
                            (displayProduct && displayProduct.length === 0)) &&
                            !isLoading && (
                                <div className={styles['empty']}>
                                    <Empty description='Không có dữ liệu' />
                                </div>
                            )}
                    </Row>
                    {showPagination && (
                        <>
                            <div style={{ marginTop: 30 }}></div>
                            <Row
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p: number, s: number) =>
                                        handleOnchangePage({
                                            current: p,
                                            pageSize: s,
                                        })
                                    }
                                />
                            </Row>
                        </>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default ProductCard;
