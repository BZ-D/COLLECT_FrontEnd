<template>
  <div>
    <div class="fixed-btn" id="message" v-model="messageNums" @click="getMessageList()" type="primary"
         style="margin-left: 16px;">
      <el-tooltip class="item" effect="dark" content="您有条消息未读" placement="left-start">
        <div slot="content" v-if="messageNums!==0">您有{{ messageNums }}条消息未读</div>
        <div slot="content" v-else>您没有未读消息</div>
        <el-badge :value=messageNums :max="99" class="item" v-if="messageNums===0" hidden>
          <img src="../../../assets/image/Message.png" style="width: 100%">
        </el-badge>
        <el-badge :value=messageNums :max="99" class="item" v-else>
          <img src="../../../assets/image/Message.png" style="width: 100%">
        </el-badge>
      </el-tooltip>
    </div>

    <el-drawer
        title="我的消息"
        ref="messageDrawer"
        :visible.sync="messageBoxVisible"
        :direction="direction"
        :with-header="false"
        :lock-scroll="false"
        size="31%"
        :before-close="handleMessageBoxClose">
      <div class="banner">
        <img src="../../../assets/image/my_message.png" alt="" style="width: 150px">
      </div>
      <el-collapse
          v-model="activeNames"
          id="message-collapse">
        <span class="el-table__empty-text" v-if="messageList.length===0">您暂无消息</span>
        <el-collapse-item v-for="(message,i) in messageList" :key="i">
          <template slot="title">
            <el-tag type="success" v-if="message.messageType===0">工人评价</el-tag>
            <el-tag type="info" v-else-if="message.messageType===2">工人协作</el-tag>
            <el-tag type="warning" v-else-if="message.messageType===1">发包方评价</el-tag>
            <el-tag v-else-if="message.messageType===6">工人关注</el-tag>
            <el-tag type="success" effect="dark" v-else-if="message.messageType===7">受邀测试</el-tag>
            <el-tag type="danger" v-else>评论被点赞</el-tag>
            <span class="span-description" v-if="message.messageType===0">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下发布的报告被众包工人<span
                  style="font-weight: 600;">{{ message.userName }}</span>评价</div>
              <span>
            您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下发布的报告被众包工人<span style="font-weight: 600;">{{ message.userName }}</span>评价
                </span>
            </el-tooltip>
            </span>

            <span class="span-description" v-else-if="message.messageType===2">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下发布的报告被众包工人
                <span style="font-weight: 600;">{{ message.userName }}</span>协作</div>
              <span>
            您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下发布的报告被众包工人<span style="font-weight: 600;">{{ message.userName }}</span>协作
              </span>
            </el-tooltip>
            </span>

            <span class="span-description_short" v-else-if="message.messageType===1">
              <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下发布的报告被发包方<span
                  style="font-weight: 600;">{{ message.userName }}</span>评价</div>
              <span>
              您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下发布的报告被发包方<span
                  style="font-weight: 600;">{{ message.userName }}</span>评价
              </span>
            </el-tooltip>
            </span>

            <span class="span-description_short" v-else-if="message.messageType===3">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下某篇报告下发布的评论“{{message.scoreContent}}”被众包工人<span
                  style="font-weight: 600;">{{ message.userName }}</span>点赞</div>
              <span>您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下某篇报告下发布的评论“{{message.scoreContent}}”被众包工人<span
                  style="font-weight: 600;">{{ message.userName }}</span>点赞</span>
            </el-tooltip>
            </span>

            <span class="span-description_short" v-else-if="message.messageType===4">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下某篇报告下发布的评论“{{message.scoreContent}}”被报告作者<span
                  style="font-weight: 600;">{{ message.userName }}</span>点赞</div>
              <span>您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下某篇报告下发布的评论“{{message.scoreContent}}”被报告作者<span
                  style="font-weight: 600;">{{ message.userName }}</span>点赞</span>
            </el-tooltip>
            </span>

            <span class="span-description_short" v-else-if="message.messageType===5">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下某篇报告下发布的评论“{{message.scoreContent}}”被发包方<span
                  style="font-weight: 600;">{{ message.userName }}</span>点赞</div>
              <span>您在任务<span style="font-weight: 600;">{{ message.taskName }}</span>下某篇报告下发布的评论“{{message.scoreContent}}”被发包方<span
                  style="font-weight: 600;">{{ message.userName }}</span>点赞</span>
            </el-tooltip>
            </span>

            <span class="span-description_short" v-else-if="message.messageType===6">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">您被众包工人<span
                  style="font-weight: 600;">{{ message.userName }}</span>follow</div>
              <span>您被众包工人<span
                  style="font-weight: 600;">{{ message.userName }}</span>follow</span>
            </el-tooltip>
            </span>

            <span class="span-description_short" v-else-if="message.messageType===7">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">您被发包方<span
                  style="font-weight: 600;">{{ message.userName }}</span>邀请完成测试任务<span style="font-weight: 600;">{{ message.taskName }}</span>
              </div>
              <span>您被发包方<span
                  style="font-weight: 600;">{{ message.userName }}</span>邀请完成测试任务<span style="font-weight: 600;">{{ message.taskName }}</span></span>
            </el-tooltip>
            </span>

            <span style="float: right;">{{ message.submitTime }}</span>

            <el-badge is-dot class="item" v-if="message.status===0"></el-badge>
          </template>
          <span v-if="message.messageType===0" style="font-weight: 600; font-size: 10px;"
                class="demonstration">评分</span>
          <el-rate
              v-if="message.messageType===0"
              v-model="message.score"
              disabled
              show-score
              text-color="#ff9900"
          >
          </el-rate>
          <span v-if="message.messageType===0" style="font-weight: 600; font-size: 10px;"
                class="demonstration">评价</span>
          <div v-if="message.messageType===0">{{ message.scoreContent }}</div>
          <br/>
          <el-button type="success" plain v-if="message.messageType!==2&&message.messageType!==7&&message.messageType!==6"
                     @click="getReportScoreDetail(message.taskId,message.reportId)">去看看
          </el-button>
          <el-button type="success" plain v-if="message.messageType===2"
                     @click="getCooReportDetail(message.taskId,message.reportId)">去看看
          </el-button>
          <el-button type="success" plain v-if="message.messageType===7"
                     @click="getInvitedTask(message.taskId)">去看看
          </el-button>
          <el-button type="danger" plain v-if="message.status===0" @click="message.status=1;setAsRead(message.id)">
            设为已读
          </el-button>
          <el-button type="danger" plain v-if="message.status===1" disabled>已读</el-button>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  </div>
</template>

<script>
import {getMyMessage} from "@/api/worker";
import {setRead} from "@/api/worker";
import {dateFormat} from "@/utils/DateFormat"

export default {
  name: "MessageDrawer",
  data() {
    return {
      activeNames: ['1'],
      messageNums: 0,
      timeout: 5 * 60 * 1000,//60秒一次心跳
      timeoutObj: null,//心跳心跳倒计时
      serverTimeoutObj: null,//心跳倒计时
      timeoutnum: null,//断开 重连倒计时
      websocket: null,
      direction: 'rtl',
      messageBoxVisible: false,
      messageList: []
    }
  },

  created() {
    this.initWebSocket();
  },
  mounted() {
    this.messageNums = Number(sessionStorage.getItem("initMessageNum"));
  },

  methods: {
    handleMessageBoxClose(done) {
      done();
    },
    initWebSocket() {
      let url = 'ws://175.24.226.64:8081/websocket/' + sessionStorage.getItem("userid");
      this.websocket = new WebSocket(url)
      this.$globalWs.setWs(this.websocket);
      // 连接错误
      this.websocket.onerror = this.setErrorMessage
      // 连接成功
      this.websocket.onopen = this.setOnopenMessage
      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage
      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    reconnect() { // 重新连接
      if (this.lockReconnect) return;
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      this.timeoutnum && clearTimeout(this.timeoutnum);
      this.timeoutnum = setTimeout(() => {
        //新连接
        this.initWebSocket();
        this.lockReconnect = false;
      }, 5000);
    },
    reset() { // 重置心跳
      // 清除时间
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      // 重启心跳
      this.start();
    },
    start() { // 开启心跳
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(() => {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (this.websocket && this.websocket.readyState === 1) { // 如果连接正常
          this.websocketsend('heartbeat');
        } else { // 否则重连
          this.reconnect();
        }
        this.serverTimeoutObj = setTimeout(() => {
          //超时关闭
          this.websocket.close();
        }, this.timeout);

      }, this.timeout)
    },
    setOnmessageMessage(event) {
      let obj = JSON.parse(event.data);
      console.log("obj", obj)
      switch (obj.type) {
        case 'heartbeat':
          //收到服务器信息，心跳重置
          console.log("心跳重置")
          this.reset();
          break;
        case 'sendMessage':
          this.messageNums = Number(obj.data)
          sessionStorage.setItem("initMessageNum", obj.data)
          console.log("接收到的服务器消息：", obj.data)
      }

    },
    setErrorMessage() {
      //重连
      this.reconnect();
      console.log("WebSocket连接发生错误" + '   状态码：' + this.websocket.readyState)
    },
    setOnopenMessage() {
      //开启心跳
      this.start();
      console.log("WebSocket连接成功" + '   状态码：' + this.websocket.readyState)
    },
    setOncloseMessage() {
      //重连
      this.reconnect();
      console.log("WebSocket连接关闭" + '   状态码：' + this.websocket.readyState)
    },
    onbeforeunload() {
      this.closeWebSocket();
    },
    //websocket发送消息
    websocketsend(messsage) {
      this.websocket.send(messsage)
    },
    closeWebSocket() { // 关闭websocket
      this.websocket.close()
    },
    async getMessageList() {
      this.messageBoxVisible = true;
      const res = await getMyMessage(sessionStorage.getItem("userid"));
      console.log(res);
      if (res.code === 500) {
        this.loading = false;
        return this.$message.error('获取消息列表失败');
      }
      if (res.code === 404) {
        this.loading = false;
        return this.$message.info('您暂无消息');
      }
      this.messageList = [];
      res.data.forEach(obj => {
        this.messageList.push(obj);
      })

      this.loading = false;
    },
    getReportScoreDetail(taskId, reportId) {
      this.$refs.messageDrawer.closeDrawer();
      this.$router.push(`/worker/cooperation/evaluate/detail/?taskid=${taskId}&reportid=${reportId}`)
    },
    getCooReportDetail(taskId,reportId){
      this.$router.push(`/worker/mytasks/corelation/?taskid=${taskId}&reportid=${reportId}`)
    },
    getInvitedTask(taskId){
      this.$router.push(`/worker/plaza/detail/${taskId}`)
    },
    async setAsRead(messageId) {
      const res = await setRead(messageId, sessionStorage.getItem("userid"));
      if (res.code === 500) {
        this.loading = false;
        return this.$message.error('设置已读失败，服务器开小差了');
      }
      this.loading = false;
    }
  },
}
</script>

<style scoped>

#message {
  z-index: 1;
  width: 50px;
  position: fixed;
  right: 4rem;
  bottom: 10rem;
  cursor: pointer;
}

.el-dialog p {
  margin-bottom: 10px;
}

#logo-region img {
  width: 300px !important;
  margin: 10px 0;
}

#message-collapse {
  margin-top: 0;
  margin-bottom: 0;
}


.fixed-btn {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: box-shadow, transform;
  transition-property: box-shadow, transform;
}

.fixed-btn:hover, .fixed-btn:focus, .fixed-btn:active {
  /*box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.5);*/
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.span-description {
  margin-left: 1%;
  width: 40%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.span-description_short{
  margin-left: 1%;
  width: 35%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
