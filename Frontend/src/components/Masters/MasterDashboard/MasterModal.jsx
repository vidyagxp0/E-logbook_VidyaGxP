import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";
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

  // 🔥 NEW: store select options per field
  const [selectOptions, setSelectOptions] = useState({});
console.log("Options for siteName:", selectOptions.siteName);

  const config = MASTER_CONFIG[activeMaster];
  const isEdit = !!editData;

  /* ================= LOAD SELECT OPTIONS FROM API ================= */
 useEffect(() => {
  if (!config) return;

 

  config.fields.forEach((field) => {
    console.log("FIELD CHECK:", field.name, field.type, field.api);
const getValueByPath = (obj, path) =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

    if (field.type === "select" && field.api) {
      console.log("CALLING API FOR:", field.name);

     axios.get(field.api.url).then((res) => {
  const apiData = Array.isArray(res.data)
    ? res.data
    : res.data.data || res.data[0] || [];

  setSelectOptions((prev) => ({
    ...prev,
    [field.name]: apiData.map((item) => ({
      label: getValueByPath(item, field.api.labelKey),
      value: getValueByPath(item, field.api.valueKey),
    })),
  }));
});
    }
  });
}, [activeMaster]);

  /* ================= PREFILL (EDIT SAFE) ================= */
  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      const mapped = {};
      config.fields.forEach((field) => {
        let value = editData[field.name];
        if (field.type === "date" && value) value = dayjs(value);
        mapped[field.name] = value ?? undefined;
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

      if (!isEdit && entries.length > 1) {
        const rows = entries.map(buildPayload);
        const requestBody = buildNestedObject(config.addPath, rows);
        await createMaster(activeMaster, requestBody);
        message.success("Created successfully");
      } else {
        const payload = buildPayload(values);

        if (isEdit) {
          await updateMaster(activeMaster, editData.id, payload);
          message.success("Updated successfully");
        } else {
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

  /* ================= FIELD RENDER (UPDATED) ================= */
  const renderField = (field, entryIndex) => {
    const onChangeHandler = (val) => {
      const value = val?.target ? val.target.value : val;
      handleEntryChange(entryIndex, field.name, value);
    };

    switch (field.type) {
      case "date":
        return <DatePicker className="w-full" onChange={onChangeHandler} />;

      case "textarea":
        return <Input.TextArea rows={2} onChange={onChangeHandler} />;

      case "select":
  return (
    <Select
      allowClear
      options={field.options || selectOptions[field.name] || []}
      onChange={(val) =>
        handleEntryChange(entryIndex, field.name, val)
      }
    />
  );


      default:
        return <Input onChange={onChangeHandler} />;
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
