<template>
    <div class="inside-content">
        <Header ref="header" />
        <div id="spinner" v-if="loader"></div>

        <div class="panelTop">
            <div class="wrapper">
                <div class="flex">
                    <div class="w30 ptb30 pb0">
                        <h1 v-if="data && data.info">
                            {{ data.info.name || data.info.user || 'User' }}
                        </h1>
                    </div>
                    <div class="w50"></div>
                    <div class="w20 al ptb20 pb0">
                        <a class="btnS" href="#" @click.prevent="openEditUser">
                            <i class="fas fa-edit"></i> Edit user
                        </a>
                    </div>
                </div>

                <div class="flex" v-if="data && data.info">
                    <div class="w50">
                        <p><b>Phone:</b> {{ data.info.phone }}</p>
                    </div>
                    <div class="w50">
                        <p><b>Email:</b> {{ data.info.email }}</p>
                    </div>
                </div>

                <div class="tabs ar">
                    <ul>
                        <li v-for="(t, i) in tabs" :key="i" :class="{active: tab == i}" @click="tab = i">
                            {{ t }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="wrapper">
            <Popup ref="new" :title="(parent && parent.formData && parent.formData.id) ? 'Edit user' : 'New user'">
                <div class="form inner-form">
                    <form @submit.prevent="action()" v-if="parent && parent.formData">
                        <div class="row">
                            <label>Name</label>
                            <input type="text" v-model="parent.formData.name" required>
                        </div>
                        <div class="row">
                            <label>Phone</label>
                            <input type="text" v-model="parent.formData.phone">
                        </div>
                        <div class="row">
                            <label>Email</label>
                            <input type="text" v-model="parent.formData.email" required>
                        </div>
                        <div class="row">
                            <label>Password</label>
                            <input type="text" v-model="parent.formData.password" placeholder="Leave empty to keep current">
                        </div>
                        <div class="row">
                            <button class="btn"><i class="fas fa-save"></i> Save</button>
                        </div>
                    </form>
                </div>
            </Popup>

            <div v-if="tab == 1">
                <div class="flex panel">
                    <div class="w100 ptb20 ac">
                        <div class="date-range">
                            <input type="date" v-model="date" @change="get()" />
                            <span>-</span>
                            <input type="date" v-model="date2" @change="get()" />
                        </div>
                    </div>
                </div>

                <div class="table">
                    <table v-if="data.sites && data.sites.length">
                        <thead>
                        <tr>
                            <th class="id">Status</th>
                            <th class="image">Site</th>
                            <th class="id">Views</th>
                            <th class="id">Clicks</th>
                            <th class="actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, i) in data.sites" :key="item.id">
                            <td class="id">
                                <Toggle v-model="item.published" @change="updateSiteStatus(item)"></Toggle>
                            </td>
                            <td class="image">{{ item.site }}</td>
                            <td class="id">{{ item.views }}</td>
                            <td class="id">{{ item.clicks }}</td>
                            <td class="actions">
                                <span style="color:gray;">No chart</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="no-data" v-else>No items.</div>
                </div>
            </div>

            <div v-if="tab == 2">
                <div class="flex panel">
                    <div class="w100 ar ptb15">
                        <a class="btnS" href="#" @click.prevent="openNewPayment"><i class="fas fa-plus"></i> Add payment</a>
                    </div>
                </div>

                <Popup ref="payment" title="Payment">
                    <div class="form inner-form">
                        <form @submit.prevent="actionPayment()" v-if="parent && parent.formData">
                            <div class="row">
                                <label>Value</label>
                                <input type="number" v-model="parent.formData.value" required>
                            </div>
                            <div class="row">
                                <label>Date</label>
                                <input type="date" v-model="parent.formData.date" required>
                            </div>
                            <div class="row">
                                <button class="btn">Save</button>
                            </div>
                        </form>
                    </div>
                </Popup>

                <div class="table">
                    <table v-if="data.payments && data.payments.length">
                        <thead>
                        <tr>
                            <th class="id">Value</th>
                            <th class="date">Date</th>
                            <th class="actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in data.payments" :key="item.id">
                            <td class="id">{{ item.value }}</td>
                            <td>{{ item.date }}</td>
                            <td class="actions">
                                <a href="#" @click.prevent="openEditPayment(item)"><i class="fas fa-edit"></i></a>
                                <a href="#" @click.prevent="delPayment(item)"><i class="fas fa-trash-alt"></i></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="no-data" v-else>No items.</div>
                </div>
            </div>

            <div v-if="tab == 0">
                <div class="flex panel">
                    <div class="w100 ptb20 ac">
                        <div class="date-range">
                            <input type="date" v-model="date" @change="get()" />
                            <span>-</span>
                            <input type="date" v-model="date2" @change="get()" />
                        </div>
                    </div>
                </div>
                <div class="table">
                    <table v-if="data.statistics && data.statistics.length">
                        <thead>
                        <tr>
                            <th class="image">Campaign</th>
                            <th class="id">Views</th>
                            <th class="id">Clicks</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in data.statistics" :key="item.id">
                            <td>{{ item.campaign_title }}</td>
                            <td class="id">{{ item.views }}</td>
                            <td class="id">{{ item.clicks }}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="no-data" v-else>No items.</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from "axios";
import Header from "../components/Header.vue";
import Popup from "../components/Popup.vue";
import Toggle from "../components/Toogle.vue";

export default {
    name: 'User',
    components: { Header, Popup, Toggle },
    data: function () {
        return {
            // Ініціалізуємо parent null, тому у шаблоні потрібні перевірки "parent &&"
            parent: null,
            data: {
                info: {},
                sites: [],
                payments: [],
                statistics: []
            },
            loader: 1,
            tabs: ["Statistics", "Sites", "Payments"],
            tab: 0,
            date: "",
            date2: "",
            userId: null
        }
    },
    mounted() {
        // Ось тут parent отримує значення, але шаблон рендериться ДО цього
        this.parent = this.$root;
        this.userId = this.$route.params.id;
        this.GetFirstAndLastDate();
        this.get();
    },
    methods: {
        GetFirstAndLastDate() {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            this.date = new Date(year, month, 2).toISOString().substring(0, 10);
            this.date2 = new Date(year, month + 1, 1).toISOString().substring(0, 10);
        },
        get() {
            var self = this;
            if (!self.parent || !self.parent.user) return;

            var data = self.parent.toFormData({ id: this.userId });
            data.append('date', this.date);
            data.append('date2', this.date2);

            self.loader = 1;
            axios.post(this.parent.url + "/site/getUser?auth=" + this.parent.user.auth, data)
                .then(function (response) {
                    self.data = response.data || {};
                    if (!self.data.info) self.data.info = {};
                    if (!self.data.sites) self.data.sites = [];
                    if (!self.data.payments) self.data.payments = [];
                    if (!self.data.statistics) self.data.statistics = [];
                    self.loader = 0;
                })
                .catch(error => {
                    console.log(error);
                    self.loader = 0;
                });
        },
        openEditUser() {
            if (this.parent && this.data.info) {
                this.parent.formData = Object.assign({}, this.data.info);
                if (!this.parent.formData.id) this.parent.formData.id = this.userId;
                this.$refs.new.active = 1;
            }
        },
        action() {
            var self = this;
            if (!self.parent.formData) return;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + "/site/actionUsers?auth=" + this.parent.user.auth, data)
                .then(function (response) {
                    self.$refs.new.active = 0;
                    if(self.$refs.header && self.$refs.header.$refs.msg) {
                        self.$refs.header.$refs.msg.successFun("User updated!");
                    }
                    self.get();
                })
                .catch(error => console.log(error));
        },
        openNewPayment() {
            this.parent.formData = { user_id: this.userId };
            this.$refs.payment.active = 1;
        },
        openEditPayment(item) {
            this.parent.formData = Object.assign({}, item);
            this.$refs.payment.active = 1;
        },
        actionPayment() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + "/site/actionPayment?auth=" + this.parent.user.auth, data)
                .then(function (response) {
                    self.$refs.payment.active = 0;
                    if(self.$refs.header && self.$refs.header.$refs.msg) {
                        self.$refs.header.$refs.msg.successFun("Payment saved!");
                    }
                    self.get();
                })
                .catch(error => console.log(error));
        },
        delPayment(item) {
            var self = this;
            var data = self.parent.toFormData(item);
            axios.post(this.parent.url + "/site/deletePayment?auth=" + this.parent.user.auth, data)
                .then(function (response) {
                    if(self.$refs.header && self.$refs.header.$refs.msg) {
                        self.$refs.header.$refs.msg.successFun("Deleted!");
                    }
                    self.get();
                });
        },
        updateSiteStatus(item) {
            var self = this;
            var data = self.parent.toFormData(item);
            axios.post(this.parent.url + "/site/actionSite?auth=" + this.parent.user.auth, data);
        }
    }
};
</script>
