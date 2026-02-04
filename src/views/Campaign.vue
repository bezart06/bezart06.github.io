<template>
    <div class="inside-content">
        <Header ref="header"/>
        <div id='spinner' v-if="loader"></div>

        <div class="panelTop" v-if="data && data.info">
            <div class="wrapper">
                <div class="flex">
                    <div class="w20 al ptb20">
                        <a class="btnS" href="#" @click.prevent="openEditCampaign">
                            <i class="fas fa-edit"></i> Edit campaign
                        </a>
                    </div>
                    <div class="w50"></div>
                    <div class="w30 ptb30">
                        <h1>{{ data.info.title }}</h1>
                    </div>
                </div>
            </div>

            <Popup ref="chart" :fullscreen="true" title="Chart">
                <div class="flex panel">
                    <div class="w70 al">
                        <div class="flex cubes" v-if="parent && parent.formData">
                            <div class="w30 ctr">
                                <div>CTR</div>
                                <span v-if="parent.formData.clicks && parent.formData.views">
                                    {{ (parent.formData.clicks * 100 / parent.formData.views).toFixed(2) }} %
                                </span>
                                <span v-else>0.00 %</span>
                            </div>
                            <div class="w30 clicks">
                                <div>Clicks</div>
                                {{ parent.formData.clicks }}
                            </div>
                            <div class="w30 views">
                                <div>Views</div>
                                {{ parent.formData.views }}
                            </div>
                            <div class="w30 leads">
                                <div>Leads</div>
                                {{ parent.formData.leads }}
                            </div>
                        </div>
                    </div>
                    <div class="date-range">
                        <input type="date" v-model="date" @change="getCampaignBannersChart();"/>
                        –
                        <input type="date" v-model="date2" @change="getCampaignBannersChart();"/>
                    </div>
                </div>
                <div class="flex body" v-if="parent && parent.formData && parent.formData.line">
                    <div class="w30 ar filchart">
                        <div class="itemchart ptb10" v-if="all">
                            All
                            <Toggle :modelValue="all" @update:modelValue="all = $event; checkAll($event)"/>
                        </div>
                        <div class="itemchart ptb10" v-if="parent.formData.sites" v-for="s in parent.formData.sites"
                             :key="s.site">
                            {{ s.site }} (V:{{ s.views }}, C:{{ s.clicks }})
                            <Toggle :modelValue="s.include"
                                    @update:modelValue="s.include = $event; getCampaignBannersChart()"/>
                        </div>
                    </div>
                    <div class="w70" id="chartOuter">
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
            </Popup>

            <Popup ref="new"
                   :title="(parent && parent.formData && parent.formData.id) ? 'Edit campaign' : 'New campaign'">
                <div class="form inner-form">
                    <form @submit.prevent="action()" v-if="parent && parent.formData">
                        <div class="row">
                            <label>Name</label>
                            <input type="text" v-model="parent.formData.title" required>
                        </div>
                        <div class="row">
                            <button class="btn">{{ (parent.formData && parent.formData.id) ? 'Edit' : 'Add' }}</button>
                        </div>
                    </form>
                </div>
            </Popup>
        </div>

        <div class="wrapper">
            <div class="flex panel">
                <div class="w20 al ptb20">
                    <a class="btnS" href="#" @click.prevent="openNewBanner">
                        <i class="fas fa-plus"></i> New Banner
                    </a>
                </div>
                <div class="date-range">
                    <input type="date" v-model="date" @change="getCampaignBannersChart();"/>
                    <span class="dash">–</span>
                    <input type="date" v-model="date2" @change="getCampaignBannersChart();"/>
                </div>
                <div class="w20 ptb30">
                    <h2>Ads List</h2>
                </div>
            </div>

            <Popup ref="ad" :title="(parent && parent.formData && parent.formData.id) ? 'Edit banner' : 'New banner'"
                   :maxHeight="'700px'">
                <div class="form inner-form">
                    <form @submit.prevent="actionAd()" v-if="parent && parent.formData">
                        <div class="row">
                            <label>Link</label>
                            <input type="text" v-model="parent.formData.link" required>
                        </div>
                        <div class="row">
                            <label>Description</label>
                            <input type="text" v-model="parent.formData.description">
                        </div>
                        <div class="row">
                            <label>Type</label>
                            <select v-model="parent.formData.type" required>
                                <option value="0">---</option>
                                <option v-if="data.types" v-for="c in data.types" :value="c.id" :key="c.id">{{
                                        c.title
                                    }}
                                </option>
                            </select>
                        </div>
                        <div class="row">
                            <label>Image</label>
                            <Image v-model="parent.formData.img"/>
                        </div>
                        <div class="row">
                            <button class="btn">{{ (parent.formData && parent.formData.id) ? 'Edit' : 'Add' }}</button>
                        </div>
                    </form>
                </div>
            </Popup>

            <Popup ref="details" fullscreen="true" title="Details">
                <div class="flex panel">
                    <div class="date-range">
                        <input type="date" v-model="date" @change="getDetails();"/>
                        <span class="dash">–</span>
                        <input type="date" v-model="date2" @change="getDetails();"/>
                    </div>
                </div>
                <br>
                <div class="table">
                    <table v-if="details && details.length">
                        <thead>
                        <tr>
                            <th class="id">#</th>
                            <th>Type</th>
                            <th>
                                IP
                                <i class="fas fa-caret-up" @click="sort='s.ip'; getDetails();" v-if="sort===''"></i>
                                <i class="fas fa-caret-down" @click="sort=''; getDetails();" v-if="sort==='s.ip'"
                                   :class="{green: sort==='s.ip'}"></i>
                            </th>
                            <th>Date</th>
                            <th>Site</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, i) in details" :key="i">
                            <td class="id">{{ item.id }}</td>
                            <td>
                                <template v-if="item.type===1">Views</template>
                                <template v-if="item.type===2">Clicks</template>
                                <template v-if="item.type===3">Leads</template>
                            </td>
                            <td>{{ item.ip }}</td>
                            <td>{{ item.date }}</td>
                            <td>{{ item.site }}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="empty" v-else>No items</div>
                </div>
            </Popup>

            <div class="table" v-if="data.items && data.items.length > 0">
                <table>
                    <thead>
                    <tr>
                        <th class="id">#</th>
                        <th class="id">On/Off</th>
                        <th class="image">Img</th>
                        <th>Size</th>
                        <th>Link</th>
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
                            <Toggle :modelValue="item.published"
                                    @update:modelValue="item.published = $event; parent.formData = item; actionAd();"/>
                        </td>
                        <td class="image">
                            <a href="#" @click.prevent="openEditBanner(item)">
                                <img v-if="parent" :src="parent.url + '/' + item.img"/>
                            </a>
                        </td>
                        <td>{{ item.size }}</td>
                        <td><a href="#" @click.prevent="openEditBanner(item)">{{ item.link }}</a></td>
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
                            <a href="#" @click.prevent="openEditBanner(item)"><i class="fas fa-edit"></i></a>
                            <a href="#" @click.prevent="openChart(item)"><i class="fas fa-chart-bar"></i></a>
                            <a href="#" @click.prevent="deleteBanner(item)"><i class="fas fa-trash-alt"></i></a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="empty" v-else>No items</div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {Chart} from "chart.js";
import Header from "../components/Header.vue";
import Popup from "../components/Popup.vue";
import Toggle from "../components/Toogle.vue";
import Image from "../components/Img.vue";

export default {
    name: 'Campaign',
    components: {Header, Popup, Toggle, Image},
    data: function () {
        return {
            parent: null,
            data: {},
            details: [],
            date: "",
            date2: "",
            q: "",
            sort: "",
            loader: 1,
            iChart: -1,
            id: 0,
            type: 0,
            all: true
        }
    },
    mounted: function () {
        this.parent = this.$root;
        this.GetFirstAndLastDate();
        this.get();

        if (this.parent && this.parent.formData) {
            this.parent.formData.date = "";
            this.parent.formData.date2 = "";
        }
    },
    methods: {
        openEditCampaign() {
            if (this.parent && this.data.info) {
                this.parent.formData = this.data.info;
                this.$refs.new.active = 1;
            }
        },
        openNewBanner() {
            if (this.parent) {
                this.parent.formData = {id: 0, link: '', description: '', type: 0, img: null};
                this.$refs.ad.active = 1;
            }
        },
        openEditBanner(item) {
            if (this.parent) {
                this.parent.formData = item;
                this.$refs.ad.active = 1;
            }
        },
        openChart(item) {
            if (this.parent) {
                this.parent.formData = item;
                this.$refs.chart.active = 1;
                this.getCampaignBannersChart();
            }
        },
        deleteBanner(item) {
            if (this.parent) {
                this.parent.formData = item;
                this.delAd();
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

            var data = self.parent.toFormData(self.parent.formData || {});
            if (this.date !== "") data.append('date', this.date);
            if (this.date2 !== "") data.append('date2', this.date2);
            if (this.$route.params.id) data.append('id', this.$route.params.id);

            self.loader = 1;
            axios.post(this.parent.url + "/site/getBanners?auth=" + this.parent.user.auth, data).then(function (response) {
                self.loader = 0;
                self.data = response.data;
                if (self.data.info && self.data.info.title) document.title = self.data.info.title;
            }).catch(function (error) {
                console.log(error);
                if (self.parent && self.parent.logout) self.parent.logout();
            });
        },
        getCampaignBannersChart: function () {
            var self = this;
            if (!self.parent || !self.parent.formData) return;
            var data = self.parent.toFormData(self.parent.formData);
            if (this.date !== "") data.append('date', this.date);
            if (this.date2 !== "") data.append('date2', this.date2);
            if (this.q !== "") data.append('q', this.q);
            if (this.sort !== "") data.append('sort', this.sort);

            self.loader = 1;
            axios.post(this.parent.url + "/site/getCampaignBannersChart?auth=" + this.parent.user.auth, data).then(function (response) {
                const item = response.data.items;
                let totalViews = 0, totalClicks = 0, totalLeads = 0;
                for (const date in item.line) {
                    totalViews += Number(item.line[date].views || 0);
                    totalClicks += Number(item.line[date].clicks || 0);
                    totalLeads += Number(item.line[date].leads || 0);
                }
                self.parent.formData.views = totalViews;
                self.parent.formData.clicks = totalClicks;
                self.parent.formData.leads = totalLeads;
                self.parent.formData.line = item.line;
                self.parent.formData.sites = item.sites;
                self.line(response.data.items);
                self.loader = 0;
            }).catch(err => console.log(err));
        },
        getDetails: function (bid = false, type = false) {
            this.details = [];
            if (bid) this.id = bid;
            if (type) this.type = type;
            var self = this;
            if (!self.parent || !self.parent.formData) return;
            var data = self.parent.toFormData(self.parent.formData);
            if (this.date !== "") data.append('date', this.date);
            if (this.date2 !== "") data.append('date2', this.date2);
            if (this.sort !== "") data.append('sort', this.sort);
            if (this.id) data.append('bid', this.id);
            if (this.type) data.append('type', this.type);

            self.loader = 1;
            axios.post(this.parent.url + "/site/getStatisticsDetails?auth=" + this.parent.user.auth, data).then(function (response) {
                self.details = response.data;
                self.loader = 0;
            }).catch(err => console.log(err));
        },
        action: function () {
            var self = this;
            if (!self.parent || !self.parent.formData) return;
            var data = self.parent.toFormData(self.parent.formData);
            axios.post(this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth, data).then(function (response) {
                self.$refs.new.active = 0;
                self.$refs.header.$refs.msg.successFun(self.parent.formData.id ? "Updated!" : "Added!");
                self.get();
            }).catch(err => console.log(err));
        },
        actionAd: function () {
            var self = this;
            if (!self.parent || !self.parent.formData) return;
            self.parent.formData.copy = "";
            var data = self.parent.toFormData(self.parent.formData);
            data.append('campaign', this.$route.params.id);
            axios.post(this.parent.url + "/site/actionBanner?auth=" + this.parent.user.auth, data).then(function (response) {
                self.$refs.ad.active = 0;
                self.$refs.header.$refs.msg.successFun(self.parent.formData.id ? "Banner Updated!" : "Banner Added!");
                self.get();
            }).catch(err => console.log(err));
        },
        delAd: async function () {
            if (await this.$refs.header.$refs.msg.confirmFun("Delete banner?", "Are you sure?")) {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);
                axios.post(this.parent.url + "/site/deleteBanner?auth=" + this.parent.user.auth, data).then(function (response) {
                    self.$refs.header.$refs.msg.successFun("Deleted!");
                    self.get();
                }).catch(err => console.log(err));
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
            if (this.parent && this.parent.formData && this.parent.formData.sites) {
                for (let i in this.parent.formData.sites) this.parent.formData.sites[i].include = prop;
            }
            this.getCampaignBannersChart();
        }
    }
};
</script>
