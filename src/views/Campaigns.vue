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
                        <a class="btnS" href="#" @click.prevent><i class="fas fa-plus"></i> New</a>
                    </div>
                </div>

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
                                <label class="switch">
                                    <input type="checkbox" checked>
                                    <span class="slider round"></span>
                                </label>
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

export default {
    name: 'Campaigns',
    components: {Header},
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
            var data = self.parent.toFormData(self.parent.formData);
            if(this.date!="") data.append('date', this.date);
            if(this.date2!="") data.append('date2', this.date2);
            self.loader=1;
            axios.post(this.parent.url+"/site/getCampaigns?auth="+this.parent.user.auth, data).then(function(response){
                self.data = response.data;
                self.loader = 0;
            }).catch(function(error){
                self.parent.logout();
            });
        },
        action:function(){
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

<style scoped>
.campaigns-container {
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #f4f6f9;
    min-height: 100vh;
    padding-bottom: 50px;
}

.inside-content {
    padding: 20px;
}

.wrapper {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.flex { display: flex; align-items: center; flex-wrap: wrap; }
.w20 { width: 20%; }
.w60 { width: 60%; }
.ptb30 { padding: 30px 0; }
.ptb20 { padding: 20px 0; }
.ac { text-align: center; }
.ar { text-align: right; }

h1 {
    font-size: 24px;
    margin: 0;
    color: #333;
}

.date-range input {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 0 5px;
    font-family: inherit;
}

.btnS {
    display: inline-block;
    padding: 10px 20px;
    background-color: #11de79;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: opacity 0.2s;
}
.btnS:hover { opacity: 0.9; }

.table {
    width: 100%;
    overflow-x: auto;
    margin-top: 10px;
}
table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}
thead tr { border-bottom: 2px solid #eee; }
th {
    text-align: left;
    padding: 15px 10px;
    color: #555;
    font-weight: 600;
}
td {
    padding: 15px 10px;
    border-bottom: 1px solid #f9f9f9;
    color: #333;
    vertical-align: middle;
}
.id { text-align: center; width: 60px; }
.actions { text-align: center; width: 120px; }

td a {
    color: #333;
    text-decoration: none;
}
td a:hover, .link-title:hover {
    color: #11de79;
}
.link-title {
    color: #007bff;
    font-weight: 500;
    text-decoration: none;
}

.actions a {
    margin: 0 5px;
    color: #888;
    font-size: 14px;
}
.actions a:hover { color: #333; }

.switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}
.slider:before {
    position: absolute;
    content: "";
    height: 14px; width: 14px;
    left: 3px; bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}
input:checked + .slider { background-color: #11de79; }
input:checked + .slider:before { transform: translateX(14px); }

#spinner {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(255,255,255,0.7) url('/public/loader.gif') no-repeat center;
    background-size: 50px;
    z-index: 2000;
}

.botBtns {
    margin-top: 20px;
    text-align: right;
}
</style>
