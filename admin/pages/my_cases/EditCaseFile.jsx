import { useEffect } from "react";
import { Form, Input, Button, Select, Upload, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { UseAxios } from "../../services/UseAxios";
import { DatePicker } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export default function EditCaseFile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Case File</h2>

      <div className="p-6 shadow-md rounded-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="bg-white p-6 "
        >
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Form.Item
                className=" hidden"
                name="client_id"
                label="Client/User ID"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="title"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Case Title
                  </span>
                }
                rules={[{ required: true }]}
              >
                <Input
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter case title"
                />
              </Form.Item>

              <Form.Item
                name="case_type"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Case Type
                  </span>
                }
              >
                <Input
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter Case Type"
                />
              </Form.Item>

              <Form.Item
                name="court_name"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Court Name
                  </span>
                }
              >
                <Input
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter Court Name"
                />
              </Form.Item>

              {/* Parties Info */}
              <Form.Item
                name="plaintiff_name"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Plaintiff Name
                  </span>
                }
              >
                <Input
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter Plaintiff Name"
                />
              </Form.Item>

              <Form.Item
                name="plaintiff_contact"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Plaintiff Contact
                  </span>
                }
              >
                <Input
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter  Plaintiff Contact"
                />
              </Form.Item>
              <Form.Item
                name="summary"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Case Summary
                  </span>
                }
                rules={[{ required: true }]}
              >
                <TextArea
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter Case Summary"
                  rows={4}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                name="defendant_name"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Defendant Name
                  </span>
                }
              >
                <Input
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter  Defendant Name"
                />
              </Form.Item>

              <Form.Item
                name="defendant_contact"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Defendant Contact
                  </span>
                }
              >
                <Input
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter Defendant Contact"
                />
              </Form.Item>

              <Form.Item
                name="status"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Status
                  </span>
                }
                rules={[{ required: true }]}
              >
                <Select
                  style={{
                    height: "48px",
                    borderRadius: "0.75rem",
                  }}
                  placeholder="Enter Status"
                >
                  <Option value="pending">Pending</Option>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="closed">Closed</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="next_hearing_date"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Next Hearing Date
                  </span>
                }
              >
                <DatePicker
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="verdict_date"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Verdict Date
                  </span>
                }
              >
                <DatePicker
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                name="verdict_summary"
                label={
                  <span className="text-lg font-semibold text-gray-700">
                    Verdict Summary
                  </span>
                }
              >
                <TextArea
                  className=" h-12 rounded-xl border-2 border-gray-300 p-3 text-gray-900 placeholder-gray-400 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300"
                  placeholder="Enter Verdict Summary"
                  rows={4}
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <Button
              style={{
                height: "48px", // h-12 = 3rem = 48px
                borderRadius: "0.75rem",
              }}
              type="primary"
              htmlType="submit"
              block
            >
              Update Case
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
