<template>
  <div class="home">
    <div class="server-wrapper" v-if="!connected">
      <div class="wrapper">
        <div class="head">
          <img src="@/common/images/logo.png" height="100%" alt />
        </div>
        <div class="content">
          <div class="left">
            <div class="title">{{ $t("title") }}</div>
            <div class="picture">
              <img src="../../assets/left.png" width="100%" alt />
            </div>
          </div>
          <div class="qrcode-wrapper">
            <div class="qrcode">
              <div class="code">
                <div class="timeout" v-if="connectTimeout">
                  <img
                    src="../../assets/refresh.png"
                    width="100%"
                    @click="refresh"
                  />
                </div>
                <img :src="qrcode" alt />
              </div>
            </div>
            <div class="tips">{{ tip }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="share-content" v-show="connected">
      <div id="iframe"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6" charset="utf-8">
import ReconnectingWebSocket from "reconnecting-websocket";
import QRCode from "qrcode";
export default {
  name: "serverHome",
  data() {
    return {
      qrcode: "",
      connectTimeout: false,
      connected: false,
      ws: null
    };
  },
  computed: {
    tip: function() {
      return this.connectTimeout ? this.$t("tips[1]") : this.$t("tips[0]");
    }
  },
  mounted() {
    this._initServer();
  },
  methods: {
    refresh() {
      this.connectTimeout = false;
      this.connected = false;
      this._initServer();
    },
    _initServer() {
      const wsUrl = "/wsconnect";
      const ws = new ReconnectingWebSocket(
        process.env.VUE_APP_SOCKET + wsUrl,
        [],
        { maxRetries: 0 }
      );
      this.ws = ws;
      ws.onopen = () => {
        console.log("open");
      };
      ws.onerror = () => {
        // ws错误提示
      };
      ws.onmessage = obj => {
        // loading
        var data = JSON.parse(obj.data);
        if (data.type === "init" && !this.connectTimeout) {
          console.log(process.env.VUE_APP_QRCODE_HOST + data.cid);
          //生成二维码渲染到页面
          this._generateQRcode(process.env.VUE_APP_QRCODE_HOST + data.cid);
          //超时90秒 切换为超时待刷新状态
          this._watchTime();
        } else if (data.type === "connect") {
          this._wsConnectedSuccess(data);
        } else {
          // 其他错误，服务错误
        }
      };
      ws.onclose = () => {
        console.log("ws close");
      };
    },
    _wsConnectedSuccess(data) {
      if (data && data.sip) {
        let params ={...data,cid: this.cid };
        this._generateIframe(params);
        this.ws.close(); // 关闭socket链接
      } else {
        // 报错
        throw new Error("服务端错误");
      }
    },
    _generateQRcode(content) {
      QRCode.toDataURL(content, {
        margin: 2,
        rendererOpts: {
          quality: 1
        }
      })
        .then(url => {
          this.qrcode = url;
          console.log(url);
        })
        .catch(err => {
          console.error(err);
        });
    },
    _watchTime() {
      const time = process.env.VUE_APP_TIMEOUT;
      setTimeout(() => {
        this.connectTimeout = true;
        this.ws.close(); // 关闭socket链接
      }, time);
    },
    _generateIframe(data) {
      this.connected = true;
      // loading start
      let iframe = document.createElement("iframe");
      iframe.src = this._generateFllPath(data);
      // iframe.src = "http://www.ushareit.com";
      iframe.className = "iframe";
      iframe.style.border = "0";
      iframe.width = "100%";
      iframe.height = "100%";
      document
        .querySelector("#iframe")
        .insertAdjacentElement("afterbegin", iframe);
      // document.getElementById("iframe").appendChild(iframe);

      // loading false
      // if (iframe.attachEvent) {
      //   console.log(iframe.attachEvent);
      //
      //   });
      // } else {
      //   iframe.onload = () => {
      //   };
      // }
    },
    _generateFllPath(data) {
      let base = "http://" + data.sip + process.env.VUE_APP_ONLINE_FILENAME;
        base = base + "?data=" + encodeURIComponent(JSON.stringify(data));
      return base;
    }
  }
};
</script>

<style lang="scss" scoped>
$qw: 1100px;
$qh: 620px;
.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.home {
  @extend .flex-column;
}

.server-wrapper {
  width: $qw;
  position: relative;
  @extend .flex-column;
}
.server-wrapper {
  max-width: $qw;
}
.wrapper {
  width: 100%;
  height: $qh;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  background: #ffffff url("../../assets/bgright.png") right bottom no-repeat;
  background-size: vw(285) 63px;
}
.head {
  padding: 0 30px;

  img {
    height: 38px;
    padding-top: 30px;
  }
}
.content {
  padding-top: 87px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.left {
  padding-left: 124px;
  @extend .flex-column;
  & .title {
    padding-left: 16px;
    width: 336px;
    font-family: Helvetica;
    font-size: 24px;
    color: #333333;
    line-height: 32px;
    font-weight: bold;
    height: 64px;
  }
  & .picture {
    width: 332px;
    padding-top: 30px;
    img {
      width: 332px;
    }
  }
}
.qrcode-wrapper {
  width: 310px;
  padding-right: 146px;
  @extend .flex-column;
  .qrcode {
    position: relative;
    img {
      width: 230px;
      height: 230px;
    }
    .timeout {
      width: 230px;
      height: 230px;
      position: absolute;
      background: rgba(255, 255, 255, 0.8);
      @extend .flex-column;
      img {
        width: 60px;
        height: 60px;
        border-radius: 60px;
        background: #ffffff;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.14);
        cursor: pointer;
      }
    }
  }
  .tips {
    padding-top: 30px;
    font-family: Helvetica;
    font-size: 19px;
    color: #333333;
    text-align: center;
    line-height: 24px;
  }
}
</style>
