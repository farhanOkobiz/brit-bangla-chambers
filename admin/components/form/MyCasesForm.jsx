import { Form, Input, Select, DatePicker, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const MyCasesForm = ({ onFinish }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const formattedData = {
      ...values,
      hearing_dates: values.hearing_dates?.map((date) => date.toISOString()),
      verdict_date: values.verdict_date?.toISOString(),
    };
    onFinish(formattedData);
  };

  return (
    <Form className="" form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="advocate_id"
        label="Advocate ID"
        rules={[{ required: true }]}
      >
        <Input placeholder="Enter Advocate ID" />
      </Form.Item>

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

      <Form.Item name="case_number" label="Case Number">
        <Input placeholder="Enter Case Number" />
      </Form.Item>

      <Form.Item name="plaintiff_name" label="Plaintiff Name">
        <Input placeholder="Enter Plaintiff Name" />
      </Form.Item>

      <Form.Item name="defendant_name" label="Defendant Name">
        <Input placeholder="Enter Defendant Name" />
      </Form.Item>

      <Form.Item name="status" label="Status" initialValue="Pending">
        <Select>
          <Option value="Pending">Pending</Option>
          <Option value="Ongoing">Ongoing</Option>
          <Option value="Closed">Closed</Option>
          <Option value="Dismissed">Dismissed</Option>
        </Select>
      </Form.Item>

      <Form.Item name="hearing_dates" label="Hearing Dates">
        <DatePicker.RangePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item name="verdict_date" label="Verdict Date">
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item name="verdict_summary" label="Verdict Summary">
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item name="progress_notes" label="Progress Notes">
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item name="is_confidential" label="Confidential?">
        <Select>
          <Option value={true}>Yes</Option>
          <Option value={false}>No</Option>
        </Select>
      </Form.Item>

      {/* Documents can be handled with a file upload field (optional) */}
      <Form.Item name="documents" label="Documents">
        <Upload beforeUpload={() => false} multiple>
          <Button icon={<UploadOutlined />}>Upload Files</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Case History
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyCasesForm;
