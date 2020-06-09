<template>
  <div>自动控制</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created:function(){
    wx.hideShareMenu();//禁止出现转发按钮
  },
  mounted(){

  }
}
</script>

<style scoped>

</style>
