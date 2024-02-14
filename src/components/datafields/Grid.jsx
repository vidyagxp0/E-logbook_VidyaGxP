import { useEffect, useState } from "react";
import "./DataFields.css";
function Grid(_props) {
  const [rows, setRows] = useState(_props.initialValues || []);

  function handleAddRow() {
    const newRow = {
      id: Math.random(),
      cells: Array.from({ length: _props.columnList.length + 1 }, (_, index) => {
        if (index === 0) {
          return rows.length + 1;
        } else {
          const column = _props.columnList[index - 1];
          return column.isEditable ? "" : column.content || column.value; // Use content if not editable, else use value
        }
      }),
    };

    setRows([...rows, newRow]);
  }

  function handleDeleteRow(id) {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  }

  const handleFileUpload = (rowId, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedRows = rows.map((row) =>
        row.id === rowId ? { ...row, cells: [...row.cells.slice(0, 1), file.name, ...row.cells.slice(2)] } : row
      );
      setRows(updatedRows);
    }
  };

  return (
    <>
      <div className="group-input grid-input-field">
        <label className="flex-label" htmlFor={_props.label}>
          {_props.required ? <div className="required"></div> : ""}
          {_props.label}
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={handleAddRow}>
            <path
              fill="#000000"
              d="M19.5 7.05h-7L9.87 3.87a1 1 0 0 0-.77-.37H4.5A2.47 2.47 0 0 0 2 5.93v12.14a2.47 2.47 0 0 0 2.5 2.43h15a2.47 2.47 0 0 0 2.5-2.43V9.48a2.47 2.47 0 0 0-2.5-2.43M14 15h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2"
            />
          </svg>
          <div className="instruction">{_props.instruction && _props.instruction}</div>
        </label>
        <div>
          <table>
            <thead>
              <tr>
                <th>Row</th>
                {_props.columnList.map((item) => (
                  <th key={item.id}>
                    <div>{item.name}</div>
                  </th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {row.cells.map((cell, index) => (
                    <td key={index}>
                      {index === 0 ? (
                        <input type="text" value={rowIndex + 1} readOnly />
                      ) : !_props.columnList[index - 1].isEditable ? (
                        <input type="text" value={_props.columnList[index - 1].content || cell} readOnly /> // Use content if available and not editable
                      ) : _props.columnList[index - 1].type === "singleSelection" ? (
                        <select
                          value={cell}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows.find((r) => r.id === row.id).cells[index] = e.target.value;
                            setRows(updatedRows);
                            _props.onChange(rows);
                          }}
                        >
                          <option value="">-- Select --</option>
                          {_props.columnList[index - 1].selectionValues.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      ) : _props.columnList[index - 1].type === "fileUpload" ? (
                        <input
                          type="file"
                          onChange={(e) => {
                            handleFileUpload(row.id, e);
                            _props.onChange(rows);
                          }}
                        />
                      ) : (
                        <input
                          type={_props.columnList[index - 1].type}
                          value={cell}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows.find((r) => r.id === row.id).cells[index] = e.target.value;
                            setRows(updatedRows);
                            _props.onChange(rows);
                          }}
                        />
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="action">
                      <div onClick={() => handleDeleteRow(row.id)}>
                        <svg width="25" height="25" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                          <path
                            fill="#FFF"
                            d="M51.76 17H20.153v37.65c0 4.06 3.29 5.62 7.35 5.62H44.41c4.06 0 7.35-1.56 7.35-5.62zM31 16v-4h10v4"
                          />
                          <path fill="#ff0000" d="M51 37v20.621L48.3 60H33z" />
                          <path fill="#FFF" d="M17 16h38v4H17z" />
                          <path
                            fill="none"
                            stroke="#ff0000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit="10"
                            strokeWidth="2"
                            d="M31 16v-4h10v4m10 9v31a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4V25m-4-9h38v4H17zm24 12.25V55M31 28.25V55"
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Grid;
