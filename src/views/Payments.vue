<template>
    <div class="payments-container">
        <Header ref="header"></Header>
        <div id="spinner" v-if="loader"></div>

        <div class="inside-content">
            <div class="wrapper">
                <div class="flex panel">
                    <div class="w30 ptb10">
                        <h2>Payments</h2>
                    </div>
                    <div class="w50"></div>
                    <div class="w20 ptb15 al"></div>
                </div>

                <Popup ref="payment" :title="'Payment Details'">
                    <div class="form inner-form" v-if="parent && parent.formData">
                        <div class="row">
                            <label>Value</label>
                            <input type="text" v-model="parent.formData.value" readonly>
                        </div>
                        <div class="row">
                            <label>Date</label>
                            <input type="text" v-model="parent.formData.date_title" readonly>
                        </div>
                        <div class="row">
                            <label>Description</label>
                            <textarea v-model="parent.formData.description" readonly></textarea>
                        </div>
                    </div>
                </Popup>

                <div class="table" v-if="data.items && data.items.length > 0">
                    <table>
                        <thead>
                        <tr>
                            <th class="id">#</th>
                            <th class="id">Value</th>
                            <th>Date</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in data.items" :key="item.id">
                            <td class="id">{{ item.id }}</td>
                            <td class="id">
                                <a href="#" @click.prevent="openPayment(item)">
                                    {{ item.value }}
                                </a>
                            </td>
                            <td>
                                <a href="#" @click.prevent="openPayment(item)">
                                    {{ item.date_title }}
                                </a>
                            </td>
                            <td>
                                {{ item.description }}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div class="empty" v-else-if="!loader">
                    No items
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Header from "../components/Header.vue";
import Popup from "../components/Popup.vue";

export default {
    name: 'Payments',
    components: {Header, Popup},
    data: function () {
        return {
            parent: null,
            data: {},
            loader: 1
        }
    },
    mounted() {
        this.parent = this.$root;

        if (this.parent && (!this.parent.user || !this.parent.user.id)) {
            this.parent.logout();
        }

        this.get();
    },
    methods: {
        get: function () {
            var self = this;
            if (!self.parent || !self.parent.user) return;

            var data = self.parent.toFormData(self.parent.formData || {});
            data.append('id', this.parent.user.id);

            self.loader = 1;
            axios.post(this.parent.url + "/site/getPayments?auth=" + this.parent.user.auth, data)
                .then(function (response) {
                    self.loader = 0;
                    self.data = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                    if (self.parent.logout) self.parent.logout();
                });
        },
        openPayment(item) {
            if (this.parent) {
                this.parent.formData = Object.assign({}, item);
                if (this.$refs.payment) {
                    this.$refs.payment.active = 1;
                }
            }
        }
    },
};
</script>
