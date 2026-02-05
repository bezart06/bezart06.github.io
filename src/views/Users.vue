<template>
    <div class="users-container">
        <Header ref="header"></Header>
        <div id="spinner" v-if="loader"></div>

        <div class="inside-content">
            <div class="wrapper">
                <div class="flex panel">
                    <div class="w20 ptb30">
                        <h1>Users</h1>
                    </div>
                    <div class="w60 ptb20 ac"></div>
                    <div class="w20 ar ptb20">
                        <a class="btnS" href="#" @click.prevent="openNewUser">
                            <i class="fas fa-plus"></i> New
                        </a>
                    </div>
                </div>

                <Popup ref="new" :title="(parent && parent.formData && parent.formData.id) ? 'Edit User' : 'New User'">
                    <div class="popup-form form inner-form">
                        <form @submit.prevent="action()" v-if="parent && parent.formData">
                            <div class="row">
                                <label>Name</label>
                                <input type="text" v-model="parent.formData.name" required>
                            </div>
                            <div class="row">
                                <label>Email</label>
                                <input type="email" v-model="parent.formData.email" required>
                            </div>
                            <div class="row">
                                <label>Phone</label>
                                <input type="text" v-model="parent.formData.phone">
                            </div>
                            <div class="row">
                                <button class="btn">
                                    <i class="fas" :class="(parent.formData.id) ? 'fa-save' : 'fa-plus'"></i>
                                    {{ (parent.formData.id) ? 'Save' : 'Add' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </Popup>

                <Popup ref="copy" :title="'Copy banner'">
                    <div class="form inner-form">
                        <form v-if="parent && parent.formData">
                            <div class="row">
                                <label>Code</label>
                                <textarea v-model="parent.formData.copy"></textarea>
                            </div>
                            <div class="row">
                                <label>Type</label>
                                <select v-model="type" @change="get()" required>
                                    <option value="0">----</option>
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
                            <th class="id">Status</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
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
                                <router-link :to="'/user/'+item.id" class="link-title">
                                    {{ item.name || item.username || item.login || item.title }}
                                </router-link>
                            </td>
                            <td>{{ item.email }}</td>
                            <td>{{ item.phone }}</td>
                            <td class="actions">
                                <router-link :to="'/user/'+item.id" title="Go to user page">
                                    <i class="fas fa-external-link-alt"></i>
                                </router-link>
                                <a href="#" @click.prevent="openEdit(item)"><i class="fas fa-edit"></i></a>
                                <a href="#" @click.prevent="openCopy(item)"><i class="fas fa-copy"></i></a>
                                <a href="#" @click.prevent="deleteUser(item)"><i class="fas fa-trash-alt"></i></a>
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
    name: 'Users',
    components: {Header, Popup, Toggle},
    data: function () {
        return {
            parent: null,
            data: {},
            loader: 1,
            type: 0
        }
    },
    mounted() {
        this.parent = this.$root;
        this.get();
    },
    methods: {
        openNewUser() {
            if (this.parent) {
                this.parent.formData = {};
                this.$refs.new.active = 1;
            }
        },
        openEdit(item) {
            if (this.parent) {
                this.parent.formData = Object.assign({}, item);
                this.$refs.new.active = 1;
            }
        },
        openCopy(item) {
            if (this.parent) {
                this.parent.formData = Object.assign({}, item);
                this.$refs.copy.active = 1;
            }
        },
        deleteUser(item) {
            if (this.parent) {
                this.parent.formData = item;
                this.del();
            }
        },
        get: function () {
            var self = this;
            if (!self.parent || !self.parent.user) return;
            var data = self.parent.toFormData({});
            if (this.type !== 0) data.append('type', this.type);
            self.loader = 1;
            axios.post(this.parent.url + "/site/getUsers?auth=" + this.parent.user.auth, data).then(function (response) {
                self.data = response.data;
                self.loader = 0;
            }).catch(error => {
                console.log(error);
                if (self.parent.logout) self.parent.logout();
            });
        },
        action: function () {
            var self = this;
            if (!self.parent.formData) return;
            var data = self.parent.toFormData(self.parent.formData);
            axios.post(this.parent.url + "/site/actionUsers?auth=" + this.parent.user.auth, data).then(function (response) {
                self.$refs.new.active = 0;
                self.$refs.header.$refs.msg.successFun(self.parent.formData.id ? "Updated!" : "Added!");
                self.get();
            }).catch(error => console.log(error));
        },
        saveStatus: function (item) {
            var self = this;
            var data = self.parent.toFormData(item);
            axios.post(this.parent.url + "/site/actionUsers?auth=" + this.parent.user.auth, data).then(function (response) {
            }).catch(error => console.log(error));
        },
        del: async function () {
            if (await this.$refs.header.$refs.msg.confirmFun("", "Delete user?")) {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);
                axios.post(this.parent.url + "/site/deleteUser?auth=" + this.parent.user.auth, data).then(function (response) {
                    if (response.data.error) self.$refs.header.$refs.msg.alertFun(response.data.error);
                    else {
                        self.$refs.header.$refs.msg.successFun("Deleted!");
                        self.get();
                    }
                }).catch(error => console.log(error));
            }
        },
        copy: async function (text) {
            if (navigator && navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                this.$refs.header.$refs.msg.successFun("Successfully copied!");
                this.$refs.copy.active = 0;
                this.parent.formData = {};
            } else {
                this.$refs.header.$refs.msg.alertFun("Use https!");
            }
        }
    },
};
</script>
