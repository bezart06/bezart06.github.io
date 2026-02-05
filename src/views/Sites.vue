<template>
    <div class="sites-container">
        <Header ref="header"></Header>
        <div id="spinner" v-if="loader"></div>

        <div class="inside-content">
            <div class="wrapper">
                <div class="flex panel">
                    <div class="w20 ptb30">
                        <h1>Sites</h1>
                    </div>
                    <div class="w60 ptb20 ac">
                        <div class="date-range">
                            <input type="date" v-model="date" @change="get()"/>
                            <span>-</span>
                            <input type="date" v-model="date2" @change="get()"/>
                        </div>
                    </div>
                    <div class="w20 ar ptb20">
                    </div>
                </div>

                <Popup ref="copy" title="Copy banner">
                    <div class="popup-form form inner-form">
                        <form v-if="parent && parent.formData" @submit.prevent>
                            <div class="row">
                                <label>Code</label>
                                <textarea v-model="parent.formData.copy"></textarea>
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
                            <th class="id"></th>
                            <th class="image">Site</th>
                            <th class="id">Views</th>
                            <th class="id">Clicks</th>
                            <th class="id">Leads</th>
                            <th class="id">Fraud clicks</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in data.items" :key="item.id">
                            <td class="id">
                                <Toggle v-model="item.published"
                                        @update:modelValue="item.published = $event; parent.formData = item; action()"/>
                            </td>
                            <td class="image">
                                {{ item.site }}
                            </td>
                            <td class="id">
                                {{ item.views }}
                            </td>
                            <td class="id">
                                {{ item.clicks || 0 }}
                            </td>
                            <td class="id">
                                {{ item.leads || 0 }}
                            </td>
                            <td class="id">
                                {{ item.fclicks || 0 }}
                            </td>
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
    name: 'Sites',
    components: {Header, Popup, Toggle},
    data: function () {
        return {
            parent: null,
            data: {},
            date: "",
            date2: "",
            loader: 1
        }
    },
    mounted() {
        this.parent = this.$root;

        if (!this.parent.user) {
            if (this.parent.logout) this.parent.logout();
        }

        this.GetFirstAndLastDate();
        this.get();
    },
    methods: {
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

            if (this.parent.user.id) {
                data.append('uid', this.parent.user.id);
            }
            if (this.date !== "") data.append('date', this.date);
            if (this.date2 !== "") data.append('date2', this.date2);

            self.loader = 1;
            axios.post(this.parent.url + "/site/getSites?auth=" + this.parent.user.auth, data).then(function (response) {
                self.loader = 0;
                self.data = response.data;
            }).catch(function (error) {
                console.log(error);
                if (self.parent.logout) self.parent.logout();
            });
        },
        action: function () {
            var self = this;
            if (!self.parent.formData) return;

            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + '/site/actionSite?auth=' + this.parent.user.auth, data).then(function (response) {
                if (self.parent.formData.id) {
                    self.$refs.header.$refs.msg.successFun("Successfully updated site!");
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully added new site!");
                }
                self.get();
            }).catch(function (error) {
                console.log('errors : ', error);
            });
        },
        copy: function (text) {
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                this.$refs.header.$refs.msg.successFun("Copied to clipboard!");
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
    },
};
</script>
