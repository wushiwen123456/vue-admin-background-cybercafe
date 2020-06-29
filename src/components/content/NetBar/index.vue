<template>
  <el-row :gutter="gutter || 0">
    <slot></slot>
  </el-row>
</template>

<script>
export default {
  name: 'NetBar',
  props: {
    gutter: {
      type: Number,
      required: false,
      default: () => {
        return 0
      },
    },
  },
}
</script>

<style></style>
