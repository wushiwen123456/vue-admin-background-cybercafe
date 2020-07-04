<template>
  <div>
    <assignment-rule v-if="typeId == 1" />
    <callback-rule v-if="typeId == 2" />
    <debug-rule v-if="typeId == 3" />
    <drive-rule v-if="typeId == 4" />
    <file-rule v-if="typeId == 5" />
    <module-rule v-if="typeId == 6" />
    <network-rule v-if="typeId == 7" />
    <plugin-rule v-if="typeId == 8" />
    <pour-into-rule v-if="typeId == 9" />
    <product-rule v-if="typeId == 10" />
    <progress-rule v-if="typeId == 11" />
    <realm-name-rule v-if="typeId == 12" />
    <regedit-rule v-if="typeId == 13" />
    <window-rule v-if="typeId == 14" />
  </div>
</template>

<script>
import AssignmentRule from './rulesComponents/AssignmentRule'
import CallbackRule from './rulesComponents/CallbackRule'
import DebugRule from './rulesComponents/DebugRule'
import DriveRule from './rulesComponents/DriveRule'
import FileRule from './rulesComponents/FileRule'
import ModuleRule from './rulesComponents/ModuleRule'
import NetworkRule from './rulesComponents/NetworkRule'
import PluginRule from './rulesComponents/PluginRule'
import PourIntoRule from './rulesComponents/PourIntoRule'
import ProductRule from './rulesComponents/ProductRule'
import ProgressRule from './rulesComponents/ProgressRule'
import RealmNameRule from './rulesComponents/RealmNameRule'
import RegeditRule from './rulesComponents/RegeditRule'
import WindowRule from './rulesComponents/WindowRule'

export default {
  name: 'RuleContent',
  components: {
    AssignmentRule,
    CallbackRule,
    DebugRule,
    DriveRule,
    FileRule,
    ModuleRule,
    NetworkRule,
    PluginRule,
    PourIntoRule,
    ProductRule,
    ProgressRule,
    RealmNameRule,
    RegeditRule,
    WindowRule,
  },
  props: {
    typeId: {
      type: Number,
      default() {
        return 0
      },
    },
  },
}
</script>
<style lang="scss" scoped></style>
