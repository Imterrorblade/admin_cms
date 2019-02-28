<template>
  <div>
    <Images v-model="imgs"></Images>
    <view-input v-model="inputValue" :value="inputValue" :options="children" componentTarget="select"></view-input>
    {{inputValue}}
  </div>
</template>
<script>
import Images from '@/components/Upload/Images'
import ViewInput from '@/components/viewinput'
// import ExtendArray from '@/utils/typeExtend/ExtendArray.js'
export default {
  data() {
    return {
      imgs: '',

      children: [{
        label: '1',
        value: '1'
      }, {
        label: '2',
        value: '2'
      }]
    }
  },
  mounted() {
    // console.log(new ExtendArray(), new ExtendArray(1, 3, 5, 6), new ExtendArray([1, 2, 4, 5]))
  },
  components: {
    Images,
    ViewInput
  }
}
</script>
