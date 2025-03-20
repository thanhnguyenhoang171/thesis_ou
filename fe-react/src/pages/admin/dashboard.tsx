import { Card, Col, Row, Statistic } from "antd";
import CountUp from "react-countup";
import { useState, useEffect } from "react";
import {
    callFetchPermission,
    callFetchProduct,
    callFetchTotalRatings,
    callFetchType,
    callFetchUser,
    callFetchTotalPositiveRatings,
    callFetchTotalNegativeRatings,
    callFetchTotalPositiveComments,
    callFetchTotalNegativeComments,
    callFetchTotalNeutralComments,
} from "@/config/api";

const DashboardPage = () => {
    const [totalRatings, setTotalRatings] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalTypes, setTotalTypes] = useState<number>(0);
    // const [totalPermissions, setTotalPermissions] = useState<number>(0);
    const [totalPositiveRatings, setTotalPositiveRatings] = useState<number>(0);
    const [totalPositiveComments, setTotalPositiveComments] =
        useState<number>(0);
    const [totalNegativeRatings, setTotalNegativeRatings] = useState<number>(0);
    const [totalNegativeComments, setTotalNegativeComments] = useState<number>(0);
     const [totalNeutralComments, setTotalNeutralComments] =
         useState<number>(0);
    const queryString = "current=0&pageSize=0";
    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const [
                    totalExistRatings,
                    totalExistUsers,
                    totalExistProduts,
                    totalExistTypes,
                    totalExistPositiveRatings,
                    totalExistPositiveComments,
                    totalExistNegativeRatings,
                    totalExistNegativeComments,
                    totalExistNeutralComments,
                ] = await Promise.all([
                    callFetchTotalRatings(),
                    callFetchUser(queryString),
                    callFetchProduct(queryString),
                    callFetchType(queryString),
                    // callFetchPermission(queryString),
                    callFetchTotalPositiveRatings(),
                    callFetchTotalPositiveComments(),
                    callFetchTotalNegativeRatings(),
                    callFetchTotalNegativeComments(),
                    callFetchTotalNeutralComments(),
                ]);
                setTotalRatings(totalExistRatings.data.totalItems);
                setTotalUsers(totalExistUsers.data?.meta.total ?? 0);
                setTotalProducts(totalExistProduts.data?.meta.total ?? 0);
                setTotalTypes(totalExistTypes.data?.meta.total ?? 0);
                setTotalPositiveRatings(
                    totalExistPositiveRatings.data?.positiveRatings ?? 0
                );
                setTotalPositiveComments(
                    totalExistPositiveComments.data?.positiveComments ?? 0
                );
                setTotalNegativeRatings(
                    totalExistNegativeRatings.data?.negativeRatings ?? 0
                );
                  setTotalNegativeComments(
                      totalExistNegativeComments.data?.negativeComments ?? 0
                );
                  setTotalNeutralComments(
                      totalExistNeutralComments.data?.neutralComments ?? 0
                  );
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };

        getDashboardData();
    }, []);

    const formatter = (value: number | string) => {
        return <CountUp end={Number(value)} separator="," />;
    };

    return (
        <Row gutter={[20, 20]}>
            <Col span={24} md={8}>
                <Card title="Tổng Đánh Giá" bordered={false}>
                    <Statistic
                        title="Total Ratings"
                        value={totalRatings}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Tổng Người Dùng" bordered={false}>
                    <Statistic
                        title="Active Users"
                        value={totalUsers} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Tổng Sản Phẩm" bordered={false}>
                    <Statistic
                        title="Total Products"
                        value={totalProducts} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card title="Tổng Loại Sản Phẩm" bordered={false}>
                    <Statistic
                        title="Total Types"
                        value={totalTypes} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card
                    title="Tổng Sản Phẩm Được Đánh Giá Là Tích Cực"
                    bordered={false}
                >
                    <Statistic
                        title="Total Positve Product Ratings"
                        value={totalPositiveRatings} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col>
            {/* <Col span={24} md={8}>
                <Card title="Tổng Quyền Truy Cập" bordered={false}>
                    <Statistic
                        title="Total Permissions"
                        value={totalPermissions} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col> */}
            {/* <Col span={24} md={8}>
                <Card title="Tổng Vai Trò" bordered={false}>
                    <Statistic
                        title="Total Roles"
                        value={totalPermissions} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col> */}
            <Col span={24} md={8}>
                <Card
                    title="Tổng Sản Phẩm Được Đánh Giá Là Tiêu Cực"
                    bordered={false}
                >
                    <Statistic
                        title="Total Negative Product Ratings"
                        value={totalNegativeRatings} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card
                    title="Tổng Sản Phẩm Được Bình Luận Là Tích Cực"
                    bordered={false}
                >
                    <Statistic
                        title="Total Products"
                        value={totalPositiveComments} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card
                    title="Tổng Sản Phẩm Được Bình Luận Là Tiêu Cực"
                    bordered={false}
                >
                    <Statistic
                        title="Total Products"
                        value={totalNegativeComments} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={24} md={8}>
                <Card
                    title="Tổng Sản Phẩm Được Bình Luận Là Bình Thường"
                    bordered={false}
                >
                    <Statistic
                        title="Total Products"
                        value={totalNeutralComments} // Example value, replace with real data if needed
                        formatter={formatter}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default DashboardPage;
