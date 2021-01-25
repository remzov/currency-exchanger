<template>
  <div>
    <form class="controls">
      <fieldset class="controls-fieldset">
        <legend class="controls-fieldset__title">
          Валюта:
        </legend>

        <v-select
          :options="selectOptions"
          label="label"
          :searchable="false"
          :clearable="false"
          :value="currentCurrency"
          @input="setSelected"
        />
      </fieldset>

      <fieldset class="controls-fieldset">
        <legend class="controls-fieldset__title">
          Доступно:
        </legend>
        <div class="controls-fieldset__sum" v-if="currencyData">
          {{formatValue(currencyData.value)}} {{currencyData.code}}
        </div>
      </fieldset>

      <fieldset class="controls-fieldset">
        <legend class="controls-fieldset__title">
          Хочу:
        </legend>

        <div class="controls-fieldset__checkbox-row">
          <label class="controls-checkbox">
            <input
              class="controls-checkbox__input"
              type="radio"
              name="action"
              :value="'buy'"
              v-model="controlState"
            >
            <span class="controls-checkbox__text">Купить</span>
          </label>

          <label class="controls-checkbox">
            <input
              class="controls-checkbox__input"
              type="radio"
              name="action"
              :value="'sell'"
              v-model="controlState"
            >
            <span class="controls-checkbox__text">Продать</span>
          </label>
        </div>

        <input
          class="controls-fieldset__input"
          type="text"
          placeholder="0,00"
          v-model="inputNumber"
          v-mask="{'alias': 'numeric', 'radixPoint': ',', 'digits': 2, 'digitsOptional': false, 'placeholder': '0', 'rightAlign': false, 'allowMinus': false}"
          @input="calcResult()"
        >
      </fieldset>

      <fieldset class="controls-fieldset">
        <legend class="controls-fieldset__title">
          {{controlState === 'buy' ? 'Заплачу:' : 'Получу:'}}
        </legend>
        <div class="controls-fieldset__sum">
          {{formatValue(result)}} ₽
        </div>
      </fieldset>

      <button
        class="button controls__submit"
        type="button"
        @click="makeTransaction()"
      >
        {{controlState === 'buy' ? 'Купить' : 'Продать'}}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Controls',

  data() {
    return {
      inputNumber: null,
      result: 0
    }
  },

  computed: {
    courses() {
      return this.$store.state.courses;
    },

    selectOptions() {
      let options = [];

      for (let item in this.courses) {
        options.push({
          code: this.courses[item].CharCode,
          label: `${this.courses[item].Name} (${this.courses[item].CharCode})`
        })
      }

      return options;
    },

    currentCurrency() {
      return this.$store.state.currentCurrency;
    },

    balance() {
      return this.$store.state.balance;
    },

    controlState: {
      set(value) {
        this.$store.commit('switchControlState', value);
      },

      get() {
        return this.$store.state.controlState;
      }
    },

    currencyData() {
      if (this.currentCurrency) {
        let data = this.balance.find(item => item.charCode === this.currentCurrency.code);

        if (data) {
          return {
            code: data.charCode,
            value: data.value
          }
        } else {
          if (this.currentCurrency) {
            return {
              code: this.currentCurrency.code,
              value: 0
            }
          }
        }
      }
    },

    number() {
      if (this.inputNumber) {
        return Number(this.inputNumber.replace(/[\,]/g, '.')).toFixed(2);
      } else {
        return 0.00;
      }
    },
  },

  methods: {
    setSelected(value) {
      this.$store.commit('setCurrentCurrency', value);
    },

    calcResult() {
        this.result =
          (this.number * (this.courses[this.currentCurrency.code].Value / this.courses[this.currentCurrency.code].Nominal));
    },

    makeTransaction() {
      if (this.controlState === 'buy') {
        let rurBalance = this.balance.find(item => item.charCode === 'RUR').value;

        if ((rurBalance) >= this.result) {
          this.$store.commit('makeTransaction', {
            sellingCurrency: {
              charCode: 'RUR',
              value: +this.result
            },
            buyingCurrency: {
              charCode: this.currentCurrency.code,
              value: +this.number
            }
          })
        }
      } else {
        let currentBalance = this.balance.find(item => item.charCode === this.currentCurrency.code);

        if (currentBalance) {
          if (+this.number <= Math.round((currentBalance.value + Number.EPSILON) * 100) / 100) {
            this.$store.commit('makeTransaction', {
              sellingCurrency: {
                charCode: this.currentCurrency.code,
                value: +this.number
              },
              buyingCurrency: {
                charCode: 'RUR',
                value: +this.result
              }
            })
          }
        }
      }
    },

    formatValue(value) {
      return new Intl.NumberFormat('ru-RU', {minimumFractionDigits: 2}).format(Math.abs(value));
    }
  }
};
</script>

<style lang="scss">
.controls {
  width: 288px;
  padding: 32px 16px;
  background-color: $color-gray;

  &__submit {
    @include reset-btn;

    width: 100%;
    padding: 8px 16px;
    background-color: $color-green;
    text-align: center;
    font-size: 13px;
    line-height: 16px;
    font-weight: 600;
    color: $color-white;
  }

  .controls-fieldset {
    margin: 0 0 16px;
    border: none;
    padding: 0;

    &__title {
      margin-bottom: 8px;
      font-size: 13px;
      line-height: 16px;
      color: $color-darkest-gray-faded;
    }

    &__sum {
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      color: $color-black;
    }

    &__checkbox-row {
      margin-bottom: 8px;
      display: flex;
    }

    &__input {
      width: 100%;
      height: 40px;
      padding: 8px 16px;
      background-color: $color-white;
      border: 1px solid $color-dark-gray;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &[type=number] {
        -moz-appearance: textfield;
      }

      ::placeholder {
        color: $color-dark-gray;
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .controls-checkbox {
    width: 50%;

    &__input {
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;

      &:checked + .controls-checkbox__text {
        color: $color-blue;
      }
    }

    &__text {
      display: block;
      width: 100%;
      padding: 8px 16px;
      border: 1px solid $color-dark-gray;
      font-size: 13px;
      line-height: 16px;
      font-weight: 600;
      text-align: center;
      background-color: $color-white;
      cursor: pointer;
    }
  }

  .v-select {
    width: 100%;
    height: 40px;
    border: 1px solid $color-dark-gray;
    background-color: $color-white;

    &::before {
      content: '';
      position: absolute;
      top: 19px;
      right: 12px;
      width: auto;
      height: auto;
      border: 4px solid transparent;
      border-top: 4px solid $color-darkest-gray;
    }

    &.vs--open {
      &::before {
        top: 14px;
        transform: rotate(180deg);
      }
    }

    .vs {
      &__dropdown-toggle {
        height: 100%;
        border-radius: 0;
      }

      &__dropdown-option {
        padding: 8px 16px;
        white-space: normal;
        font-size: 13px;
        line-height: 16px;

        &--highlight {
          background: $color-other-gray;
          color: $color-black;
        }
      }

      &__selected {
        margin: 0;
        display: block;
        width: 240px;
        height: 100%;
        padding: 8px 13px;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__actions {
        display: none;
      }
    }
  }

  .vs--single.vs--open .vs__selected {
    opacity: 1;
  }
}
</style>
