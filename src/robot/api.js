const http = require('http');
const util = require('./util');
const xml2json = require('xml2json');

function getTodaysHistory(callBack) {
    const date = new Date();

    http.get("http://api.juheapi.com/japi/toh?v=1.0&month=" + (date.getMonth() + 1) + "&day=" + date.getDate() + "&key=e7be7efcaa9eaaa150fee985a397a40e", function (res) {
        res.setEncoding("utf-8");
        const resData = [];
        res.on("data", function (chunk) {
            resData.push(chunk);
        })
            .on("end", function () {
                const array = JSON.parse(resData.join(""));
                if (array.error_code == 0) {
                    const index = util.rd(0, array.result.length - 1);
                    callBack(array.result[index]);
                }
            });
    })

}

function getTrainTimeList(code, callBack) {
    const api = "http://ws.webxml.com.cn/WebServices/TrainTimeWebService.asmx/getDetailInfoByTrainCode?TrainCode=" + code + "&UserID=";
    http.get(api, function (res) {
        res.setEncoding("utf-8");
        const resData = [];
        res.on("data", function (chunk) {
            resData.push(chunk);
        })
            .on("end", function () {
                const result = resData.join("");
                const json = xml2json.toJson(result);
                const objec = JSON.parse(json);
                const trainDetailInfo = objec.DataSet['diffgr:diffgram'].getDetailInfo.TrainDetailInfo;

                if (Array.isArray(trainDetailInfo)) {
                    callBack(true, trainDetailInfo)
                }else{
                    callBack(false, trainDetailInfo.TrainStation)
                }
            });

    })

}

module.exports = {
    getTodaysHistory,
    getTrainTimeList
};


// http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=手机号
// http://suggest.taobao.com/sug?code=utf-8&q=商品关键字&callback=cb   淘宝商品搜索建议
