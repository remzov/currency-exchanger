import Vue from 'vue';
import Vuex from 'vuex';
import constants from './constants';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    date: null,
    courses: null,
    balance: [
      {
        charCode: 'RUR',
        value: 10000
      }
    ],
    currentCurrency: null,
    controlState: 'buy',
  },
  actions: {
    async getCoursesData({commit}) {
      await fetch(constants.apiUrl)
        .then(res => res.json())
        .then(res => {
          commit('setDate', formatDate(res.Date));
          commit('setCourses', res.Valute);
          commit('setCurrentCurrency', {
            code: res.Valute[Object.keys(res.Valute)[0]].CharCode,
            label:
              `${res.Valute[Object.keys(res.Valute)[0]].Name} (${res.Valute[Object.keys(res.Valute)[0]].CharCode})`
          });
        });
    }
  },
  mutations: {
    setDate(state, payload) {
      state.date = payload;
    },

    setCourses(state, payload) {
      state.courses = payload;
    },

    setCurrentCurrency(state, payload) {
      state.currentCurrency = payload;
    },

    switchControlState(state, payload) {
      state.controlState = payload;
    },

    makeTransaction(state, payload) {
      let sellingCurrancy = state.balance.find(item => item.charCode === payload.sellingCurrency.charCode);
      let buyingCurrency = state.balance.find(item => item.charCode === payload.buyingCurrency.charCode);

      sellingCurrancy.value -= payload.sellingCurrency.value;

      if (buyingCurrency) {
        buyingCurrency.value += payload.buyingCurrency.value;
      } else {
        state.balance.push({
          charCode: payload.buyingCurrency.charCode,
          value: payload.buyingCurrency.value
        })
      }
    }
  },
  plugins: [createPersistedState()]
});

function formatDate(str) {
  let date = new Date(str);
  let day = (date.getDay() < 10) ? '0' + date.getDay() : date.getDay();
  let month = (date.getMonth() < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}