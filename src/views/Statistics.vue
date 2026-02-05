<template>
    <div class="statistics-container">
        <Header ref="header"></Header>
        <div id="spinner" v-if="loader"></div>

        <div class="inside-content">
            <div class="wrapper">
                <div class="flex panel">
                    <div class="w20 ptb10">
                        <h2>Statistics</h2>
                    </div>
                    <div class="w60 ptb20 ac">
                        <div class="date-range">
                            <input type="date" v-model="date" @change="get()" />
                            <span>-</span>
                            <input type="date" v-model="date2" @change="get()" />
                        </div>
                    </div>
                    <div class="w20 ptb15 al">
                        <a href="#" class="btnS" @click.prevent="parent.formData.copy = data.multi; $refs.copy.active=1;">
                            <i class="fas fa-images"></i>
                            Multi banners
                        </a>
                    </div>
                </div>

                <Popup ref="img" title="Banner">
                    <div class="ac">
                        <img :src="parent.formData.img" v-if="parent.formData && parent.formData.img" style="max-width: 100%;" />
                    </div>
                </Popup>

                <Popup ref="copy" title="Copy banner">
                    <div class="form inner-form">
                        <form v-if="parent.formData">
                            <div class="row">
                                <label>Code</label>
                                <textarea v-model="parent.formData.copy" rows="5"></textarea>
                            </div>

                            <div class="row">
                                <label>Type</label>
                                <select v-model="type" @change="get()" required>
                                    <option value="0">---</option>
                                    <option v-if="data.types" v-for="c in data.types" :key="c.id" :value="c.id">{{ c.title }}</option>
                                </select>
                            </div>

                            <div class="row">
                                <button class="btn" @click.prevent="copy(parent.formData.copy)">Copy code</button>
                            </div>
                        </form>
                    </div>
                </Popup>

                <div class="table">
                    <table v-if="data.items && data.items.length">
                        <thead>
                        <tr>
                            <th class="id">#</th>
                            <th class="image">Img</th>
                            <th class="image">Campaign</th>
                            <th>Link</th>
                            <th class="id">Views</th>
                            <th class="id">Clicks</th>
                            <th class="id">Leads</th>
                            <th class="id">Fraud clicks</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in data.items" :key="item.id">
                            <td class="id">
                                <Toggle v-model="item.published" @change="parent.formData = item; actionStatistic();" />
                            </td>
                            <td class="image">
                                <a href="#" @click.prevent="parent.formData=item; $refs.img.active=1">
                                    <img :src="item.img" style="height: 50px; width: auto;" />
                                </a>
                            </td>
                            <td class="image">{{ item.campaign_title }}</td>
                            <td>{{ item.link }}</td>
                            <td class="id">{{ item.views }}</td>
                            <td class="id">{{ item.clicks || 0 }}</td>
                            <td class="id">{{ item.leads || 0 }}</td>
                            <td class="id">{{ item.fclicks || 0 }}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div v-else class="no-data">No items.</div>
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
    name: 'Statistics',
    components: { Header, Popup, Toggle },
    data: function () {
        return {
            parent: null,
            data: {},
            date: "",
            date2: "",
            loader: 1,
            type: 0
        }
    },
    mounted: function () {
        this.parent = this.$root;
        this.GetFirstAndLastDate();

        if (this.parent.user) {
            this.get();
        } else {
            this.get();
        }
    },
    methods: {
        GetFirstAndLastDate: function () {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            // Настройка дат, как в исходном коде
            var firstDayOfMonth = new Date(year, month, 2);
            var lastDayOfMonth = new Date(year, month + 1, 1);

            this.date = firstDayOfMonth.toISOString().substring(0, 10);
            this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
        },
        get: function () {
            var self = this;
            if (!self.parent || !self.parent.user) return; // Защита от отсутствия юзера

            var objToSend = self.parent.formData || {};
            var data = self.parent.toFormData(objToSend);

            data.append('id', this.parent.user.id);
            data.append('type', 'user');
            if (this.date != "") data.append('date', this.date);
            if (this.date2 != "") data.append('date2', this.date2);
            if (this.type != 0) data.append('type', this.type); // type != 0, так как 0 это "---"

            self.loader = 1;
            axios.post(this.parent.url + "/site/getStatistics?auth=" + this.parent.user.auth, data).then(function (response) {
                self.loader = 0;
                self.data = response.data;
                if (response.data.types && response.data.types[0] && !self.type) {
                    self.type = response.data.types[0].id;
                }
                if (self.parent.formData) {
                    self.parent.formData.copy = self.data.multi;
                }
            }).catch(function (error) {
                console.log(error);
                if (self.parent.logout) self.parent.logout();
            });
        },
        actionStatistic: function () {
            var self = this;
            if (!self.parent.formData) return;

            var data = self.parent.toFormData(self.parent.formData);
            data.append('uid', this.parent.user.id);

            axios.post(this.parent.url + "/site/actionStatistic?auth=" + this.parent.user.auth, data).then(function (response) {
                if (response.data.error) {
                    self.$refs.header.$refs.msg.alertFun(response.data.error);
                    return false;
                }

                if (self.parent.formData.id) {
                    self.$refs.header.$refs.msg.successFun("Successfully updated banner!");
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully added new banner!");
                }

                self.get();
            }).catch(function (error) {
                console.log('errors : ', error);
            });
        },
        copy: async function (text) {
            if (navigator && navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(text);
                    this.$refs.header.$refs.msg.successFun("Successfully copied!");
                    this.$refs.copy.active = 0;
                    this.parent.formData = {};
                } catch (err) {
                    this.$refs.header.$refs.msg.alertFun("Failed to copy!");
                }
            } else {
                this.$refs.header.$refs.msg.alertFun("Use https/clipboard API not supported!");
            }
        }
    }
}
</script>
