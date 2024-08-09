export const ColumnType = {
  TEXT: "text",
  NUMBER: "number",
  SELECT: "select",
  MULTI_SELECT: "multi_select",
  DATE: "date",
  CHECKBOX: "checkbox",
  PRIMARY: "primary",
};

/**
 * columnInfo: {
 *  columnName: string;
 *  type: ColumnType;
 *  options?: string[];
 * }
 */
const module = {
  extractColumnInfo(data) {
    const columnNames = data.data.column_order;
    const rows = data.data.rows;

    const columnInfo = [];
    var hasOptionalColumn = false;
    for (let i = 0; i < columnNames.length; i++) {
      const columnName = columnNames[i].toLowerCase();
      const columnData = { columnName: columnName };
      columnData.type = rows[0].data[columnName].type;
      if (
        columnData.type === ColumnType.SELECT ||
        columnData.type === ColumnType.MULTI_SELECT
      ) {
        columnData.options = new Set();
        hasOptionalColumn = true;
      }
      columnInfo.push(columnData);
    }

    if (hasOptionalColumn) {
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columnNames.length; j++) {
          const columnName = columnNames[j].toLowerCase();
          const columnData = columnInfo[j];
          if (
            columnData.type === ColumnType.SELECT ||
            columnData.type === ColumnType.MULTI_SELECT
          ) {
            const selects = rows[i].data[columnName].value.split(",");
            for (let k = 0; k < selects.length; k++) {
              if (selects[k] !== "") {
                columnData.options.add(selects[k]);
              }
            }
          }
        }
      }
      columnInfo.forEach((columnData) => {
        if (
          columnData.type === ColumnType.SELECT ||
          columnData.type === ColumnType.MULTI_SELECT
        ) {
          columnData.options = Array.from(columnData.options);
        }
      });
    }
    return columnInfo;
  },

  /**
   *
   * @param {Array<{type:string}>} columns
   * @returns {Array<{type:string}>}
   */
  sortColumn(columns) {
    console.log("sortColumn", columns);
    
    var sortArr = [];
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].type === ColumnType.PRIMARY) {
        sortArr.unshift(columns[i]);
      } else {
        sortArr.push(columns[i]);
      }
    }
    return sortArr;
  },
};

export default module;
