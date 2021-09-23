const formatTimeStamp = (timeStamp) => {
    var date = new Date(timeStamp);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s
}

exports.template = function(body) {
    //企业微信群机器人API: https://work.weixin.qq.com/api/doc/90000/90136/91770#markdown%E7%B1%BB%E5%9E%8B
    //prometheus alert manager webhook： https://prometheus.io/docs/alerting/configuration/#webhook_config
    var alerts = body.alerts;
    var content = alerts.map(
        alert => {
            if ( `${alert.status}` === 'firing' ) {
                return [`### 告警主题：${alert.labels.alertname}`]
                .concat(`<font color="comment">告警描述：</font>${alert.annotations.description}`)
                .concat(`<font color="comment">告警概要：</font>${alert.annotations.summary}`)
                .concat(`<font color="comment">触发阀值：</font>${alert.annotations.value}`)
                .concat(`<font color="comment">告警级别：</font>${alert.labels.severity}`)
                .concat(`<font color="comment">告警实例：</font>**${alert.labels.instance}**`)
                .concat(`<font color="comment">告警任务：</font>${alert.labels.job}`)
                .concat(`<font color="comment">故障时间：</font>${formatTimeStamp((Date.parse(alert.startsAt)))}`)
                .concat(`<font color="comment">告警状态：</font><font color="warning">故障\n</font>`)
                .join("\n\n")
            }
            if ( `${alert.status}` === 'resolved' ) {
                return [`### 告警主题：${alert.labels.alertname}`]
                //.concat(`<font color="comment">告警描述：</font>${alert.annotations.description}`)
                .concat(`<font color="comment">告警概要：</font>${alert.annotations.summary}`)
                //.concat(`<font color="comment">触发阀值：</font>${alert.annotations.value}`)
                //.concat(`<font color="comment">告警级别：</font>${alert.labels.severity}`)
                //.concat(`<font color="comment">告警实例：</font>**${alert.labels.instance}**`)
                //.concat(`<font color="comment">告警任务：</font>${alert.labels.job}`)
                .concat(`<font color="comment">故障时间：</font>${formatTimeStamp((Date.parse(alert.startsAt)))}`)
                .concat(`<font color="comment">恢复时间：</font>${formatTimeStamp((Date.parse(alert.endsAt)))}`)
                .concat(`<font color="comment">告警状态：</font><font color="info">恢复\n</font>`)
                .join("\n\n")
            }
        }
    ).join("\n\n");
    return {
        msgtype: "markdown",
        markdown: {
            content: content
        }
    }
}
