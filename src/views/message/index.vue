<template>
  <div class="message-container">
    <!-- <div class="main-left"> -->
    <!-- <a-menu
        :style="{ width: '190px', height: '100%', 'background-color': 'rgba(255,255,255,0.8)' }"
        :default-open-keys="['0']"
        :default-selected-keys="['0_2']"
      >
        <a-menu-item key="0_0"></a-menu-item>
        <a-menu-item key="0_1">Menu 2</a-menu-item>
        <a-menu-item key="0_2">Menu 3</a-menu-item>
        <a-menu-item key="0_3">Menu 4</a-menu-item>
      </a-menu> -->
    <!-- </div> -->
    <div class="main-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.message-container {
  width: 1200px;
  /* background-color: #fff; */
  margin: 0 auto;
  display: flex;
  /* height: calc(100% - 80px); */
  /* box-shadow: 0 2px 4px 0 rgb(121 146 185 / 54%); */
  box-sizing: border-box;
}

.main-left {
  max-width: 190px;
  width: 190px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}

.main-right {
  margin-left: 10px;
  width: 1000px;
  background-color: #fff;
  height: calc(100% - 10px);
  box-sizing: border-box;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .message-container {
    width: 100vw;
  }
  .main-right {
    width: 100%;
    margin-left: 0;
  }
}
</style>
