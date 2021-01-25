<template>
  <div class="balance">
    <h2 class="balance__title">Баланс</h2>
    <table class="balance-table">
      <tbody>
        <tr
          v-for="(item, index) of balance"
          :key="index"
        >
          <td>
            {{item.charCode}}
          </td>
          <td>
            {{formatValue(item.value.toFixed(2))}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Balance',

  computed: {
    balance() {
      return this.$store.state.balance.filter(
        item => (Math.round((item.value + Number.EPSILON) * 100) / 100) > 0
      );
    }
  },

  methods: {
    formatValue(value) {
      return new Intl.NumberFormat('ru-RU', {minimumFractionDigits: 2}).format(value);
    }
  }
}
</script>

<style lang="scss">
.balance {
  width: 288px;
  padding: 32px 16px;
  background-color: $color-gray;

  &__title {
    margin-bottom: 16px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: $color-black;
  }

  .balance-table {
    width: 100%;

    td {
      width: 50%;
      padding: 8px 0;
      font-size: 13px;
      line-height: 16px;

      &:nth-child(1) {
        text-align: left;
      }

      &:nth-child(2) {
        text-align: right;
      }
    }
  }
}
</style>