<template>
  <div class="courses">
    <h2 class="courses__title">Курс валют на {{date}}</h2>

    <table class="courses-table">
      <thead>
        <tr>
          <th>
            Код
          </th>
          <th>
            Единиц
          </th>
          <th>
            Курс
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) of courses"
          :key="index"
        >
          <td>{{item.CharCode}}</td>
          <td>{{item.Nominal}}</td>
          <td :class="setCourseClass(item.Value, item.Previous)">
            {{formatValue(item.Value.toFixed(4))}} ({{setCourseDif(item.Value, item.Previous)}})
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const coursesClasses = {
  increased: 'courses-table__cell_increased-value',
  decreased: 'courses-table__cell_decreased-value'
}

export default {
  name: 'Courses',

  computed: {
    date() {
      return this.$store.state.date;
    },

    courses() {
      return this.$store.state.courses;
    }
  },

  methods: {
    setCourseClass(currentVal, prevVal) {
      if ((currentVal - prevVal) > 0.1) {
        return coursesClasses.increased;
      }

      if ((currentVal - prevVal) < 0) {
        return coursesClasses.decreased;
      }

      return;
    },

    setCourseDif(currentVal, prevVal) {
      let dif = (currentVal.toFixed(2) - prevVal.toFixed(2)).toFixed(1);

      if (dif > 0.1) {
        return `+${dif}`
      }

      return dif;
    },

    formatValue(value) {
      return value.replace(/[\.]/g, ',')
    }
  }
}
</script>

<style lang="scss">
.courses {
  width: 352px;
  height: 424px;
  overflow-y: scroll;
  padding: 32px 16px;

  &__title {
    margin-left: 16px;
    margin-bottom: 16px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: $color-black;
  }

  .courses-table {
    width: 100%;

    thead {
      tr {
        box-shadow: 0px 1px 0px $color-darkest-gray-faded;
      }
    }

    th {
      padding: 8px 16px;
      text-align: center;
      font-size: 13px;
      line-height: 16px;
      font-weight: 400;
      color: $color-darkest-gray-faded;

      &:nth-child(1) {
        width: 64px;
      }

      &:nth-child(2) {
        width: 128px;
      }

      &:nth-child(3) {
        width: 128px;
      }
    }

    td {
      padding: 8px 16px;
      text-align: center;
      font-size: 13px;
      line-height: 16px;
      font-weight: 400;

      &:nth-child(1) {
        width: 64px;
      }

      &:nth-child(2) {
        width: 128px;
      }

      &:nth-child(3) {
        width: 128px;
      }
    }

    &__cell {
      &_increased-value {
        color: $color-green;
      }

      &_decreased-value {
        color: $color-red;
      }
    }
  }
}
</style>