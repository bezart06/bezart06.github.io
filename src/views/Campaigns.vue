<template>
    <div class="campaigns-container">
        <Header ref="header"></Header>
        <div id="spinner" v-if="loader"></div>

        <div class="inside-content">
            <div class="wrapper">
                <div class="flex panel">
                    <div class="w20 ptb30">
                        <h1>Campaigns</h1>
                    </div>
                    <div class="w60 ptb20 ac">
                        <div class="date-range">
                            <input type="date" v-model="date" @change="get()"/>
                            <span>-</span>
                            <input type="date" v-model="date2" @change="get()"/>
                        </div>
                    </div>
                    <div class="w20 ar ptb20">
                        <a class="btnS" href="#" @click.prevent="openNewCampaign">
                            <i class="fas fa-plus"></i> New
                        </a>
                    </div>
                </div>

                <Popup ref="new"
                       :title="(parent && parent.formData && parent.formData.id) ? 'Edit campaign' : 'New campaign'">
                    <div class="popup-form form inner-form">
                        <form @submit.prevent="action()" v-if="parent && parent.formData">
                            <div class="row">
                                <label>Name</label>
                                <input type="text" v-model="parent.formData.title" required>
                            </div>
                            <div class="row">
                                <button class="btn">
                                    <i class="fas" :class="(parent.formData.id) ? 'fa-save' : 'fa-plus'"></i>
                                    {{ (parent.formData.id) ? 'Edit' : 'Add' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </Popup>

                <div class="table">
                    <table v-if="data.items && data.items.length">
                        <thead>
                        <tr>
                            <th class="id">#</th>
                            <th class="id">Status</th>
                            <th>Title</th>
                            <th class="id">Views</th>
                            <th class="id">Clicks</th>
                            <th class="id">Leads</th>
                            <th class="id">Fraud</th>
                            <th class="actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, i) in data.items" :key="item.id">
                            <td class="id">{{ item.id }}</td>
                            <td class="id">
                                <Toggle v-model="item.status" @change="saveStatus(item)"/>
                            </td>
                            <td>
                                <router-link :to="'/campaign/'+item.id" class="link-title">{{
                                        item.title
                                    }}
                                </router-link>
                            </td>
                            <td class="id"><a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 1)">{{
                                    item.views
                                }}</a></td>
                            <td class="id"><a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 2)">{{
                                    item.clicks || 0
                                }}</a></td>
                            <td class="id"><a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 3)">{{
                                    item.leads || 0
                                }}</a></td>
                            <td class="id"><a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">{{
                                    item.fclicks || 0
                                }}</a></td>
                            <td class="actions">
                                <router-link :to="'/campaign/'+item.id"><i class="fas fa-edit"></i></router-link>
                                <a href="#" @click.prevent="openChart(item, i)"><i class="fas fa-chart-bar"></i></a>
                                <a href="#" @click.prevent="deleteCampaign(item)"><i class="fas fa-trash-alt"></i></a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div v-else class="no-data">No items.</div>
                </div>

                <Popup ref="chart" fullscreen="true" title="Chart">
                    <div class="flex panel">
                        <div class="date-range">
                            <input type="date" v-model="date" @change="get()"/>
                            <span>-</span>
                            <input type="date" v-model="date2" @change="get()"/>
                        </div>
                    </div>
                    <div class="flex body" v-if="iChart !== -1 && data.items[iChart]">
                        <div class="w30 ar filchart">
                            <div class="itemchart ptb10" v-if="all">
                                <Toggle v-model="all" @update:modelValue="all = $event; checkAll($event)"/>
                                All
                            </div>
                            <div class="itemchart ptb10" v-if="data.items[iChart].sites"
                                 v-for="s in data.items[iChart].sites">
                                <Toggle v-model="s.include"
                                        @update:modelValue="s.include = $event; parent.formData = data.items[iChart]; get()"/>
                                {{ s.site }}
                            </div>
                        </div>
                        <div class="w70" id="chartOuter">
                            <canvas id="myChart"></canvas>
                        </div>
                    </div>
                </Popup>

            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Header from "../components/Header.vue";
import Popup from "../components/Popup.vue";
import Toggle from "../components/Toogle.vue";
import {Chart} from "chart.js";

export default {
    name: 'Campaigns',
    components: {Header, Popup, Toggle},
    data: function () {
        return {
            parent: null,
            data: {},
            date: "", date2: "",
            loader: 1, iChart: -1, all: true
        }
    },
    mounted() {
        this.parent = this.$root;
        this.GetFirstAndLastDate();
        this.get();
    },
    methods: {
        openNewCampaign() {
            if (this.parent) {
                this.parent.formData = {};
                this.$refs.new.active = 1;
            }
        },
        openChart(item, index) {
            if (this.parent) {
                this.parent.formData = item;
                this.iChart = index;
                this.$refs.chart.active = 1;
                this.line(item);
            }
        },
        deleteCampaign(item) {
            if (this.parent) {
                this.parent.formData = item;
                this.del();
            }
        },
        GetFirstAndLastDate: function () {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            this.date = new Date(year, month, 2).toISOString().substring(0, 10);
            this.date2 = new Date(year, month + 1, 1).toISOString().substring(0, 10);
        },
        get: function () {
            var self = this;
            if (!self.parent || !self.parent.user) return;
            var data = self.parent.toFormData({});
            if (this.date !== "") data.append('date', this.date);
            if (this.date2 !== "") data.append('date2', this.date2);
            self.loader = 1;
            axios.post(this.parent.url + "/site/getCampaigns?auth=" + this.parent.user.auth, data).then(function (response) {
                self.data = response.data;
                self.loader = 0;
                if (self.iChart !== -1 && self.data.items && self.data.items[self.iChart]) {
                    self.line(self.data.items[self.iChart]);
                }
            }).catch(error => {
                console.log(error);
                if (self.parent.logout) self.parent.logout();
            });
        },
        action: function () {
            var self = this;
            if (!self.parent.formData) return;
            self.parent.formData.copy = "";
            var data = self.parent.toFormData(self.parent.formData);
            axios.post(this.parent.url + "/site/actionCampaigns?auth=" + this.parent.user.auth, data).then(function (response) {
                self.$refs.new.active = 0;
                self.$refs.header.$refs.msg.successFun(self.parent.formData.id ? "Updated!" : "Added!");
                self.get();
            }).catch(error => console.log(error));
        },
        del: async function () {
            if (await this.$refs.header.$refs.msg.confirmFun("", "Delete campaign?")) {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);
                axios.post(this.parent.url + "/site/deleteCampaign?auth=" + this.parent.user.auth, data).then(function (response) {
                    if (response.data.error) self.$refs.header.$refs.msg.alertFun(response.data.error);
                    else {
                        self.$refs.header.$refs.msg.successFun("Deleted!");
                        self.get();
                    }
                }).catch(error => console.log(error));
            }
        },
        line: function (item) {
            setTimeout(function () {
                let dates = [], clicks = [], views = [];
                if (item && item.line) {
                    for (let i in item.line) {
                        dates.push(i);
                        clicks.push(item.line[i].clicks);
                        views.push(item.line[i].views);
                    }
                }
                const chartContainer = document.getElementById('chartOuter');
                if (chartContainer) chartContainer.innerHTML = '<canvas id="myChart"></canvas>';
                const ctx = document.getElementById('myChart');
                if (!ctx) return;
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [
                            {label: "Clicks", backgroundColor: "#00599D", borderColor: "#00599D", data: clicks},
                            {label: "Views", backgroundColor: "#5000B8", borderColor: "#5000B8", data: views},
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {legend: {display: false}},
                        scales: {y: {position: 'right'}, x: {afterFit: (s) => s.height = 30}}
                    }
                });
            }, 100);
        },
        checkAll: function (prop) {
            if (this.data.items[this.iChart].sites) {
                for (let i in this.data.items[this.iChart].sites) this.data.items[this.iChart].sites[i].include = prop;
            }
            this.parent.formData = this.data.items[this.iChart];
            this.get();
        }
    },
};
</script>
