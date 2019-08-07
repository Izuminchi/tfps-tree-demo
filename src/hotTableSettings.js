export default {
  hotSetting: {
    startRows: 15,
    rowHeaders: true,
    minSpareRows: 1,
    manualColumnResize: true,
    contextMenu: {
      items: {
        'row_above': { name: '一行上に追加する' },
        'row_below': { name: '一行下に追加する' },
        'remove_row': { name: '行を削除する' }
      }
    }
  },
  numSetting: {
    validator: /^([1-9][0-9]*)*$/,
    allowInvalid: false
  }
}