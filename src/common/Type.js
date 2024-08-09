/**
 * @typedef {Object} SettingInfo
 * @property {string} appId
 * @property {string} appSecret
 * @property {string} appToken
 * @property {string} curDataBase
 * @property {ColumnInfo[]} dataBaseStructure
 */

/**
 * @typedef {Object} ColumnInfo
 * @property {string} columnName
 * @property {ColumnType} type
 * @property {string[]} options
 */

/**
 * @typedef {Object} RowData
 * @property {string} columnName
 * @property {any} value
 */

/**
 * @typedef {Object} ResponseData
 * @property {ResponseState} state
 * @property {string} message
 * @property {Object} data
 */

/**
 * @typedef {Object} UpdateDataBaseReqeustData
 * @property {string} todo
 * @property {string} appToken
 * @property {string} curDataBase
 */

/**
 * @typedef {Object} SaveSettingsReqeustData
 * @property {string} todo
 * @property {string} appId
 * @property {string} appSecret
 * @property {string} curDataBase
 */

/**
 * @typedef {Object} PostNoteReqeustData
 * @property {string} todo
 * @property {RowData} data
 * @property {string} dataBaseId
 */

/**
 * @enum {string}
 */
export const ResponseState = {
  SUCCESS: "success",
  ERROR: "error",
};

/**
 * @enum {string}
 */
export const ColumnType = {
  TEXT: "text",
  NUMBER: "number",
  SELECT: "select",
  MULTI_SELECT: "multi_select",
  DATE: "date",
  CHECKBOX: "checkbox",
  PRIMARY: "primary",
};
