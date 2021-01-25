<template>
  <div id="app">
    <div class="container">
      <Controls/>
      <Courses/>
      <Balance/>
    </div>
  </div>
</template>

<script>
import Controls from './components/Controls.vue';
import Courses from './components/Courses.vue';
import Balance from './components/Balance.vue';

export default {
  name: 'App',
  components: {
    Controls,
    Courses,
    Balance
  },

  mounted() {
    this.$store.dispatch('getCoursesData');
  }
};
</script>