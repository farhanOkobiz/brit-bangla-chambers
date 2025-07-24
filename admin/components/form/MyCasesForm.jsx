import { Form, Input, Select, DatePicker, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAxios } from "../../services/useAxios";
import { useEffect } from "react";

const { TextArea } = Input;
const { Option } = Select;

const MyCasesForm = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = (values) => {
    const formattedData = {
      client_id: values.client_id || null,
      title: values.title,
      summary: values.summary,
      case_type: values.case_type,
      court_name: values.court_name,
      status: values.status?.toLowerCase(),

      // Nested fields
      parties: {
        plaintiff: {
          name: values.plaintiff_name || "",
          contact: values.plaintiff_contact || "",
        },
        defendant: {
          name: values.defendant_name || "",
          contact: values.defendant_contact || "",
        },
      },

      judgment: {
        decision_date: values.verdict_date || null,
        decision_summary: values.verdict_summary || "",
        court_order_url: "", // optional, placeholder
      },

      hearing_dates: (values.hearing_dates || []).map((date) =>
        date.toISOString()
      ),

      documents: fileList.map((file) => ({
        filename: file.name,
        file_url: file.url || "", // real upload should give URL
      })),
    };

    onFinish(formattedData);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="client_id" label="Client/User ID">
        <Input placeholder="Enter Client/User ID" />
      </Form.Item>

      <Form.Item name="title" label="Case Title" rules={[{ required: true }]}>
        <Input placeholder="Enter Case Title" />
      </Form.Item>

      <Form.Item
        name="summary"
        label="Case Summary"
        rules={[{ required: true }]}
      >
        <TextArea rows={4} placeholder="Enter Summary" />
      </Form.Item>

      <Form.Item name="case_type" label="Case Type">
        <Input placeholder="Enter Case Type" />
      </Form.Item>

      <Form.Item name="court_name" label="Court Name">
        <Input placeholder="Enter Court Name" />
      </Form.Item>

      {/* Plaintiff & Defendant Fields */}
      <Form.Item name="plaintiff_name" label="Plaintiff Name">
        <Input placeholder="Enter Plaintiff Name" />
      </Form.Item>
      <Form.Item name="plaintiff_contact" label="Plaintiff Contact">
        <Input placeholder="Enter Plaintiff Contact" />
      </Form.Item>

      <Form.Item name="defendant_name" label="Defendant Name">
        <Input placeholder="Enter Defendant Name" />
      </Form.Item>
      <Form.Item name="defendant_contact" label="Defendant Contact">
        <Input placeholder="Enter Defendant Contact" />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        initialValue="pending"
        rules={[{ required: true }]}
      >
        <Select>
          <Option value="pending">Pending</Option>
          <Option value="in_progress">In Progress</Option>
          <Option value="closed">Closed</Option>
        </Select>
      </Form.Item>

      <Form.Item name="hearing_dates" label="Hearing Dates">
        <DatePicker.RangePicker format="YYYY-MM-DD" />
      </Form.Item>

      {/* Judgment */}
      <Form.Item name="verdict_date" label="Verdict Date">
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item name="verdict_summary" label="Verdict Summary">
        <TextArea rows={3} />
      </Form.Item>

      {/* Documents */}
      <Form.Item name="documents" label="Documents">
        <Upload
          beforeUpload={() => false}
          multiple
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
        >
          <Button icon={<UploadOutlined />}>Upload Files</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Case
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyCasesForm;
