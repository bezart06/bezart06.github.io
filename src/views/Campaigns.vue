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
                            <input type="date" v-model="date" @change="get()" />
                            <span>-</span>
                            <input type="date" v-model="date2" @change="get()" />
                        </div>
                    </div>
                    <div class="w20 ar ptb20">
                        <a class="btnS" href="#" @click.prevent="parent.formData={}; $refs.new.active=1"><i class="fas fa-plus"></i> New</a>
                    </div>
                </div>

                <Popup ref="new" :title="(parent && parent.formData && parent.formData.id) ? 'Edit campaign' : 'New campaign'">
                    <div class="popup-form">
                        <form @submit.prevent="action()" v-if="parent && parent.formData">

                            <div class="input-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    v-model="parent.formData.title"
                                    required
                                >
                            </div>

                            <div class="botBtns">
                                <button class="btnS">
                                    <i class="fas" :class="(parent && parent.formData.id) ? 'fa-save' : 'fa-plus'"></i>
                                    {{ (parent && parent.formData.id) ? 'Edit' : 'Add' }}
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
                            <th class="id"></th>
                            <th>Title</th>
                            <th class="id">Views</th>
                            <th class="id">Clicks</th>
                            <th class="id">Leads</th>
                            <th class="id">Fraud clicks</th>
                            <th class="actions">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in data.items" :key="item.id">
                            <td class="id">{{ item.id }}</td>
                            <td class="id">
                                <Toggle
                                    v-model="item.status"
                                    @change="saveStatus(item)"
                                />
                            </td>
                            <td>
                                <router-link :to="'/campaign/'+item.id" class="link-title">
                                    {{ item.title }}
                                </router-link>
                            </td>
                            <td class="id">
                                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 1)">
                                    {{item.views}}
                                </a>
                            </td>
                            <td class="id">
                                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 2)">
                                    <template v-if="item.clicks">{{item.clicks}}</template>
                                    <template v-if="!item.clicks">0</template>
                                </a>
                            </td>
                            <td class="id">
                                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 3)">
                                    <template v-if="item.leads">{{item.leads}}</template>
                                    <template v-if="!item.leads">0</template>
                                </a>
                            </td>
                            <td class="id">
                                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">
                                    <template v-if="item.fclicks">{{item.fclicks}}</template>
                                    <template v-if="!item.fclicks">0</template>
                                </a>
                            </td>
                            <td class="actions">
                                <a href="#" @click.prevent="parent.formData = item; del();">
                                    <i class="fas fa-trash-alt"></i>
                                </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div v-else class="no-data">
                        No items.
                    </div>
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
    name: 'Campaigns',
    components: {Header, Popup, Toggle},
    data:function() {
        return {
            parent: null,
            data:{},
            details:{},
            date:"",
            date2:"",
            q:"",
            sort:"",
            loader:1,
            id:0,
            type:0,
            all:true
        }
    },
    mounted() {
        this.parent = this.$root;
        this.get();
        this.GetFirstAndLastDate();
    },
    methods:{
        GetFirstAndLastDate:function(){
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var firstDayOfMonth = new Date(year, month, 2);
            var lastDayOfMonth = new Date(year, month + 1, 1);

            this.date = firstDayOfMonth.toISOString().substring(0, 10);
            this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
        },
        get:function(){
            var self = this;
            var data = self.parent.toFormData({});

            if (this.date != "") data.append('date', this.date);
            if (this.date2 != "") data.append('date2', this.date2);
            self.loader = 1;

            axios.post(this.parent.url + "/site/getCampaigns?auth=" + this.parent.user.auth, data)
                .then(function(response) {
                    self.data = response.data;
                    self.loader = 0;
                })
                .catch(function(error) {
                    self.parent.logout();
                });
        },
        action: function() {
            var self = this;
            self.parent.formData.copy = "";
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url+"/site/actionCampaigns?auth="+this.parent.user.auth, data).then(function(response){
                self.$refs.new.active = 0;
                if(self.parent.formData.id){
                    self.$refs.header.$refs.msg.successFun("Successfully updated campaign!");
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully added new campaign!");
                }

                self.get();
            }).catch(function(error){
                console.log('errors : ', error);
            });
        },
        del:async function(){
            if(await this.$refs.header.$refs.msg.confirmFun("", "Do you want to delete this campaign?")){
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url+"/site/deleteCampaign?auth="+this.parent.user.auth, data).then(function(response) {
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully deleted campaign!");
                        self.get();
                    }
                }).catch(function(error){
                    console.log('errors : ', error);
                });
            }
        }
    }
};
</script>
