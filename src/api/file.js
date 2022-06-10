import axios from "axios";


export const uploadFile = payload => {
  return axios.post(`file/upload`, payload).then(res => {
    return res.data;
  });
};

export const downloadFile = filename => {
  return axios({url: `file/download/${filename}`, responseType: 'blob',}).then(response => {
    //return res.data;
    if (!response || !response.data) {
      self.$message({
        type: 'error',
        message: "导出失败！"
      });
      return;
    }
    let blob = new Blob([response.data]);//response.data为后端传的流文件
    let downloadFilename = filename
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //兼容ie浏览器
      window.navigator.msSaveOrOpenBlob(blob, downloadFilename)
    } else {
      //谷歌,火狐等浏览器
      let url = window.URL.createObjectURL(blob);
      let downloadElement = document.createElement("a");
      downloadElement.style.display = "none";
      downloadElement.href = url;
      downloadElement.download = downloadFilename;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(url);
    }
  });
};
