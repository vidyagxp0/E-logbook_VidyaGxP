import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import dayjs from "dayjs";
import { MASTER_CONFIG } from "./masterConfig";
import { createMaster, updateMaster } from "../MasterServices";

/* ================= BUILD NESTED OBJECT ================= */
const buildNestedObject = (path, value) => {
  if (!path) return value;

  return path.split(".").reduceRight((acc, key) => ({ [key]: acc }), value);
};

const MasterModal = ({ open, onClose, activeMaster, editData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // add-multiple
  const [entries, setEntries] = useState([{}]);

  const config = MASTER_CONFIG[activeMaster];
  const isEdit = !!editData;

  /* ================= PREFILL (EDIT SAFE) ================= */
  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      const mapped = {};
      config.fields.forEach((field) => {
        let value = editData[field.name];
        if (field.type === "date" && value) value = dayjs(value);
        mapped[field.name] = value ?? null;
      });
      form.setFieldsValue(mapped);
    } else {
      form.resetFields();
      setEntries([{}]);
    }
  }, [open, editData, activeMaster]);

  /* ================= ADD MODE ENTRY CHANGE ================= */
  const handleEntryChange = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const addRow = () => setEntries([...entries, {}]);
  const removeRow = (index) =>
    setEntries(entries.filter((_, i) => i !== index));

  /* ================= PAYLOAD BUILDER ================= */
  const buildPayload = (data) => {
    const payload = {};
    config.fields.forEach((field) => {
      let value = data[field.name];
      if (field.type === "date" && value) {
        value = dayjs(value).format("YYYY-MM-DD");
      }
      payload[field.name] = value;
    });
    return payload;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      /* ===== ADD MULTIPLE ===== */
      if (!isEdit && entries.length > 1) {
        const rows = entries.map(buildPayload);
        const requestBody = buildNestedObject(config.addPath, rows);

        await createMaster(activeMaster, requestBody);
        message.success("Created successfully");
      } else {
        /* ===== ADD / EDIT SINGLE ===== */
        const payload = buildPayload(values);

        if (isEdit) {
          // ✅ EDIT = FLAT
          await updateMaster(activeMaster, editData.id, payload);
          message.success("Updated successfully");
        } else {
          // ✅ ADD = NESTED
          const requestBody = buildNestedObject(config.addPath, payload);

          await createMaster(activeMaster, requestBody);
          message.success("Created successfully");
        }
      }

      form.resetFields();
      setEntries([{}]);
      onClose(true);
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FIELD RENDER ================= */
  const renderField = (field, entryIndex) => {
    if (isEdit) {
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
    }

    switch (field.type) {
      case "date":
        return (
          <DatePicker
            className="w-full"
            onChange={(d) => handleEntryChange(entryIndex, field.name, d)}
          />
        );
      case "textarea":
        return (
          <Input.TextArea
            rows={2}
            onChange={(e) =>
              handleEntryChange(entryIndex, field.name, e.target.value)
            }
          />
        );
      case "select":
        return (
          <Select
            onChange={(v) => handleEntryChange(entryIndex, field.name, v)}
          >
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
          </Select>
        );
      default:
        return (
          <Input
            onChange={(e) =>
              handleEntryChange(entryIndex, field.name, e.target.value)
            }
          />
        );
    }
  };

  return (
    <Modal
      title={`${isEdit ? "Edit" : "Add"} ${activeMaster}`}
      open={open}
      onCancel={() => onClose(false)}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={900}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        {(isEdit ? [{}] : entries).map((_, entryIndex) => (
          <div key={entryIndex} className="mb-4 border p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              {config.fields.map((field) => (
                <Form.Item
                  key={`${entryIndex}-${field.name}`}
                  name={field.name}
                  label={field.label}
                  rules={[{ required: true }]}
                >
                  {renderField(field, entryIndex)}
                </Form.Item>
              ))}
            </div>

            {!isEdit && entries.length > 1 && (
              <Button danger type="link" onClick={() => removeRow(entryIndex)}>
                Remove Row
              </Button>
            )}
          </div>
        ))}
      </Form>

      {!isEdit && (
        <Button type="dashed" onClick={addRow} block>
          + Add Row
        </Button>
      )}
    </Modal>
  );
};

export default MasterModal;
