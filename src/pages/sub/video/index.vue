<template>
  <div class="insetWrap">
    <TitleBar :navTitle="this.$root.$mp.query.videoName"></TitleBar>
    <video direction="0"
    :src="videoUrl"
    controls="true"
    objectFit="cover"
    autoplay
    :show-play-btn="false"
    :style="{'margin-top':(navH)+'px'}"
    >
    </video>
  </div>
</template>

<script>

import TitleBar from "@/components/titleBar/index";

export default {
  components: {
    TitleBar
  },
  data () {
    return {
      num:'',
      videoUrl:'',
      navH:this.$store.state.navH
    }
  },
  mounted(){
    this.num = this.$root.$mp.query.num
    this.getVideoUrl();
  },
  created(){

  },
  methods: {
    // 获取视频监控地址
    getVideoUrl(){
      this.$httpWX.get({
        url: '/ys/live/video',
        data: {
          deviceSerial: this.num,
        }
      }).then(res => {
        var data = res.data;
        console.log(data);
        // this.videoUrl = "http://hls01open.ys7.com/openlive/92185fae71934fca881ea590d40134e3.m3u8"
      })
    }
  }
};
</script>

<style scoped>
video{
  width: 100%;
  height: 211px;
}
</style>
