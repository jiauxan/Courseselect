<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
var sno = "";
export default {
  name: "App"
  // ,
  // methods:{
  //   getData(){
  //     var that = this.$http.get('api/sysuser/list')
  //           .then(function (response) {
  //             console.log(response.data)
  //             console.log(this)
  //             that.serverData = response.data
  //           })
  //           .catch(function (error) {
  //             console.log(error)
  //           })
  //   }
  // }
};
</script>

<style>
body {
  height: 100%;
  width: 100%;
}
.land {
  width: 25%;
  height: 40%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
