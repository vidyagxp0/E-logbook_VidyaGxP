import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker } from "antd";

const AddMasterModal = ({ open, onClose, onSave, editData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  return (
    <Modal
      title="Batch Header"
      open={open}
      onCancel={onClose}
      onOk={() => {
        form.validateFields().then((values) => {
          onSave(values);
          form.resetFields();
        });
      }}
      width={900}
      okText="Save"
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="site_name" label="Site Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="site_code" label="Site Code">
            <Input />
          </Form.Item>

          <Form.Item name="product_name" label="Product Name">
            <Input />
          </Form.Item>

          <Form.Item name="product_code" label="Product Code">
            <Input />
          </Form.Item>

          <Form.Item name="strength" label="Strength">
            <Input />
          </Form.Item>

          <Form.Item name="batch_no" label="Batch No">
            <Input />
          </Form.Item>

          <Form.Item name="batch_size" label="Batch Size">
            <Input />
          </Form.Item>

          <Form.Item name="market" label="Market">
            <Input />
          </Form.Item>

          <Form.Item name="mfg_date" label="Mfg Date">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="expiry_date" label="Expiry Date">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="general_instructions" label="General Instructions">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="bmr_version" label="BMR Version">
            <Input />
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input />
          </Form.Item>

          <Form.Item name="prepared_by" label="Prepared By">
            <Input />
          </Form.Item>

          <Form.Item name="checked_by" label="Checked By (QA)">
            <Input />
          </Form.Item>

          <Form.Item name="approved_by" label="Approved By (QA Head)">
            <Input />
          </Form.Item>

          <Form.Item name="total_pages" label="Total Pages Issued">
            <Input />
          </Form.Item>

          <Form.Item name="page_verified" label="Page Nos Verified">
            <Input />
          </Form.Item>

          <Form.Item name="reissue_reason" label="Re-issue Reason">
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddMasterModal;
