import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { UseAxios } from "../../services/UseAxios";
import { DatePicker } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export default function EditUserFile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await UseAxios(`/showOwnCaseFile/singleCaseFile/${id}`);

        const data = res.data?.data;
        // Set initial values
        form.setFieldsValue({
          client_id: data.client_id,
          title: data.title,
          summary: data.summary,
          case_type: data.case_type,
          court_name: data.court_name,
          plaintiff_name: data?.parties?.plaintiff?.name || "",
          plaintiff_contact: data?.parties?.plaintiff?.contact || "",
          defendant_name: data?.parties?.defendant?.name || "",
          defendant_contact: data?.parties?.defendant?.contact || "",
          status: data.status,
          verdict_summary: data?.judgment?.decision_summary || "",
          verdict_date: data?.verdict_date ? dayjs(data.verdict_date) : null,
          next_hearing_date: data?.next_hearing_date
            ? dayjs(data.next_hearing_date)
            : null,
        });

        // Set file list if needed (Optional)
        // setFileList(data.documents || []);
      } catch (err) {
        console.error("Error fetching case file:", err);
        message.error("Failed to load case file.");
      }
    };

    fetchCase();
  }, [id, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        parties: {
          plaintiff: {
            name: values.plaintiff_name,
            contact: values.plaintiff_contact,
          },
          defendant: {
            name: values.defendant_name,
            contact: values.defendant_contact,
          },
        },
        judgment: {
          decision_date: values.verdict_date?.toDate(),
          decision_summary: values.verdict_summary,
        },
        verdict_date: values.verdict_date?.toDate() || null,
        next_hearing_date: values.next_hearing_date?.toDate() || null,
        documents: fileList.map((file) => ({
          filename: file.name,
          file_url: "",
        })),
      };

      await UseAxios(`/showOwnCaseFile/updateCaseFile/${id}`, {
        method: "PUT",
        data: payload,
      });

      message.success("Case updated successfully!");
      navigate("/advocate/dashboard/all-user-file");
    } catch (err) {
      console.error(err);
      message.error("Failed to update case.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 mt-10">
      <div className="bg-[#f0f4f8] text-gray-800 px-6 py-4 border-b rounded-t-2xl">
        <h2 className="text-xl font-bold">Update Case</h2>
      </div>
      <div className="p-6 space-y-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-4"
        >
          <Form.Item name="client_id" className="hidden">
            <Input />
          </Form.Item>

          <Form.Item
            name="title"
            label={
              <span className="font-medium text-gray-700">Case Title</span>
            }
            rules={[{ required: true }]}
          >
            <Input className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="summary"
            label={
              <span className="font-medium text-gray-700">Case Summary</span>
            }
            rules={[{ required: true }]}
          >
            <TextArea rows={4} className="rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="case_type"
              label={
                <span className="font-medium text-gray-700">Case Type</span>
              }
            >
              <Input className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="court_name"
              label={
                <span className="font-medium text-gray-700">Court Name</span>
              }
            >
              <Input className="rounded-lg" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="plaintiff_name"
              label={
                <span className="font-medium text-gray-700">
                  Plaintiff Name
                </span>
              }
            >
              <Input className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="plaintiff_contact"
              label={
                <span className="font-medium text-gray-700">
                  Plaintiff Contact
                </span>
              }
            >
              <Input className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="defendant_name"
              label={
                <span className="font-medium text-gray-700">
                  Defendant Name
                </span>
              }
            >
              <Input className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="defendant_contact"
              label={
                <span className="font-medium text-gray-700">
                  Defendant Contact
                </span>
              }
            >
              <Input className="rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label={<span className="font-medium text-gray-700">Status</span>}
            rules={[{ required: true }]}
          >
            <Select className="rounded-lg">
              <Option value="pending">Pending</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="verdict_summary"
            label={
              <span className="font-medium text-gray-700">Verdict Summary</span>
            }
          >
            <TextArea rows={3} className="rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="next_hearing_date"
              label={
                <span className="font-medium text-gray-700">
                  Next Hearing Date
                </span>
              }
            >
              <DatePicker style={{ width: "100%" }} className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="verdict_date"
              label={
                <span className="font-medium text-gray-700">Verdict Date</span>
              }
            >
              <DatePicker style={{ width: "100%" }} className="rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="documents"
            label={<span className="font-medium text-gray-700">Documents</span>}
          >
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
            <Button
              type="primary"
              htmlType="submit"
              block
              className="rounded-lg"
            >
              Update Case
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
