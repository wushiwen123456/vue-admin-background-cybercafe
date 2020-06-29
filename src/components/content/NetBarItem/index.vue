<template>
  <div class="net-bar-item" :class="{ 'border-right': borderRight }">
    <el-button type="text" :style="{ color: color }">
      <span class="net-bar-number">{{ number }}</span>
    </el-button>
    <span>{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: 'NetBarItem',
  props: {
    name: {
      type: String,
      required: true,
      default: () => {
        return ''
      },
    },
    color: {
      type: String,
      required: false,
      default: () => {
        return '#f56c6c'
      },
    },
    number: {
      type: Number,
      required: true,
      default: () => {
        return 0
      },
    },
    borderRight: {
      type: Boolean,
      required: true,
      default: () => {
        return true
      },
    },
  },
  data() {
    return {
      BaseColor: '#f56c6c',
    }
  },
}
</script>

<style lang="scss" scoped>
.net-bar-item {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  color: $base-color-default2;
}
.border-right {
}
.el-button {
  font-size: 24px;
}
.net-bar-number:hover {
  text-decoration: underline;
}
</style>
