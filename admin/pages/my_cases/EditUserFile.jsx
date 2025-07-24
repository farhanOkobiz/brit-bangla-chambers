import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAxios } from "../../services/useAxios";

const { Option } = Select;
const { TextArea } = Input;

export default function EditUserFile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const res = await useAxios(`/caseFile/${id}`);
        const data = res.data?.data;

        // Set initial values
        form.setFieldsValue({
          client_id: data.client_id,
          title: data.title,
          summary: data.summary,
          case_type: data.case_type,
          court_name: data.court_name,
          plaintiff_name: data?.parties?.plaintiff_name || "",
          plaintiff_contact: data?.parties?.plaintiff_contact || "",
          defendant_name: data?.parties?.defendant_name || "",
          defendant_contact: data?.parties?.defendant_contact || "",
          status: data.status,
          verdict_date: data.judgment?.verdict_date
            ? dayjs(data.judgment.verdict_date)
            : null,
          verdict_summary: data.judgment?.verdict_summary || "",
          hearing_dates: data.hearing_dates
            ? [dayjs(data.hearing_dates[0]), dayjs(data.hearing_dates[1])]
            : null,
        });

        // Set file list if needed (Optional)
        // setFileList(data.documents || []);
      } catch (err) {
        message.error("Failed to load case file.");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        parties: {
          plaintiff_name: values.plaintiff_name,
          plaintiff_contact: values.plaintiff_contact,
          defendant_name: values.defendant_name,
          defendant_contact: values.defendant_contact,
        },
        judgment: {
          verdict_date: values.verdict_date?.toDate(), // ✅ Fixed
          verdict_summary: values.verdict_summary,
        },
        hearing_dates: values.hearing_dates
          ? values.hearing_dates.map((d) => d.toDate())
          : [],

        documents: fileList.map((file) => file.name),
      };

      await useAxios(`/caseFile/${id}`, {
        method: "PUT",
        data: payload,
      });

      message.success("Case updated successfully!");
      navigate("/advocate/dashboard/all-user-file");
    } catch (err) {
      console.error(err);
      message.error("Failed to update case.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Case File</h2>

      <div className="p-6 shadow-2xl rounded-lg">
        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="bg-white p-6 "
          >
            <Form.Item name="client_id" label="Client/User ID">
              <Input />
            </Form.Item>

            <Form.Item
              name="title"
              label="Case Title"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="summary"
              label="Case Summary"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="case_type" label="Case Type">
              <Input />
            </Form.Item>

            <Form.Item name="court_name" label="Court Name">
              <Input />
            </Form.Item>

            {/* Parties Info */}
            <Form.Item name="plaintiff_name" label="Plaintiff Name">
              <Input />
            </Form.Item>

            <Form.Item name="plaintiff_contact" label="Plaintiff Contact">
              <Input />
            </Form.Item>

            <Form.Item name="defendant_name" label="Defendant Name">
              <Input />
            </Form.Item>

            <Form.Item name="defendant_contact" label="Defendant Contact">
              <Input />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
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

            <Form.Item name="verdict_date" label="Verdict Date">
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item name="verdict_summary" label="Verdict Summary">
              <TextArea rows={3} />
            </Form.Item>

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
              <Button type="primary" htmlType="submit" block loading={loading}>
                Update Case
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}
