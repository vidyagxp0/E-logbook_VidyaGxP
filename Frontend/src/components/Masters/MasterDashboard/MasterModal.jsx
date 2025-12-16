import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select } from "antd";
import { MASTER_CONFIG } from "./masterConfig";

const MasterModal = ({ open, onClose, onSave, activeMaster, editData }) => {
  const [form] = Form.useForm();
  const config = MASTER_CONFIG[activeMaster];

  useEffect(() => {
    editData ? form.setFieldsValue(editData) : form.resetFields();
  }, [editData]);

  const renderField = (field) => {
    switch (field.type) {
      case "date":
        return <DatePicker className="w-full" />;
      case "textarea":
        return <Input.TextArea rows={2} />;
      case "select":
        return (
          <Select>
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        );
      default:
        return <Input />;
    }
  };

  return (
    <Modal
      title={`Add ${activeMaster}`}
      open={open}
      onCancel={onClose}
      width={900}
      onOk={() => {
        form.validateFields().then((values) => {
          onSave(values);
          form.resetFields();
        });
      }}
    >
      <Form layout="vertical" form={form}>
        <div className="grid grid-cols-2 gap-4">
          {config.fields.map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={[{ required: true }]}
            >
              {renderField(field)}
            </Form.Item>
          ))}
        </div>
      </Form>
    </Modal>
  );
};

export default MasterModal;
