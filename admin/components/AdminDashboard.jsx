import { Card, Statistic, Row, Col, Table } from "antd";

const stats = [
  { title: "Total Users", value: 1245 },
  { title: "Active Cases", value: 87 },
  { title: "Pending Requests", value: 14 },
  { title: "Revenue (This Month)", value: "$12,340" },
];

const recentUsers = [
  { key: 1, name: "John Doe", email: "john@example.com", role: "Client" },
  { key: 2, name: "Jane Smith", email: "jane@example.com", role: "Advocate" },
  { key: 3, name: "Alice Brown", email: "alice@example.com", role: "Client" },
  { key: 4, name: "Bob Lee", email: "bob@example.com", role: "Admin" },
];

const columns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
];

function AdminDashboard() {
  return (
    <Card title="Admin Dashboard" style={{ margin: 24 }}>
      <Row gutter={[24, 24]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} md={6} key={stat.title}>
            <Card>
              <Statistic title={stat.title} value={stat.value} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="Recent Users" style={{ marginTop: 32 }}>
        <Table columns={columns} dataSource={recentUsers} pagination={false} />
      </Card>
    </Card>
  );
}

export default AdminDashboard;
