<template>
    <div class="inside-content">
        <Header ref="header"/>

        <div id='spinner' v-if="loader"></div>

        <div class="wrapper">
            <div class="flex panel">
                <div class="w10 ptb30">
                    <h1>Ads</h1>
                </div>
                <div class="w70"></div>
                <div class="w20 al ptb20">
                </div>
            </div>

            <Popup ref="copy" :title="'Copy banner'">
                <div class="form inner-form">
                    <form v-if="$root.formData">
                        <div class="row">
                            <label>Code</label>
                            <textarea v-model="$root.formData.copy"></textarea>
                        </div>

                        <div class="row">
                            <button class="btn" @click.prevent="copy($root.formData.copy)">Copy code</button>
                        </div>
                    </form>
                </div>
            </Popup>

            <div class="table" v-if="adsData.items && adsData.items.length">
                <table>
                    <thead>
                    <tr>
                        <th class="id">#</th>
                        <th class="image"></th>
                        <th class="image">Campaign</th>
                        <th>Link</th>
                        <th class="actions">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in adsData.items" :key="item.id">
                        <td class="id">{{ item.id }}</td>

                        <td class="image">
                            <a href="#" @click.prevent="openEdit(item)">
                                <img :src="$root.url + '/' + item.img"/>
                            </a>
                        </td>
                        <td class="image">
                            <a href="#" @click.prevent="openEdit(item)">{{ item.campaign_title }}</a>
                        </td>
                        <td>
                            <a href="#" @click.prevent="openEdit(item)">{{ item.link }}</a>
                        </td>
                        <td class="actions">
                            <a href="#" @click.prevent="openCopy(item)">
                                <i class="fas fa-copy"></i>
                            </a>
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
</template>

<script>
import axios from 'axios';
import Header from '../components/Header.vue';
import Popup from '../components/Popup.vue';

export default {
    name: 'Ads',
    components: {
        Header,
        Popup
    },
    data() {
        return {
            adsData: {},
            loader: 1
        }
    },
    mounted() {
        if (!this.$root.user || !this.$root.user.auth) {
            this.$root.logout();
        } else {
            this.get();
        }
    },
    methods: {
        get() {
            const formData = this.$root.toFormData(this.$root.formData);
            formData.append('uid', this.$root.user.id);
            formData.append('type', 'user');

            this.loader = 1;

            axios.post(this.$root.url + "/site/getBanners?auth=" + this.$root.user.auth, formData)
                .then((response) => {
                    this.loader = 0;
                    this.adsData = response.data;
                })
                .catch((error) => {
                    console.error(error);
                    this.$root.logout();
                });
        },
        async copy(text) {
            if (navigator && navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(text);

                    if (this.$refs.header && this.$refs.header.$refs.msg) {
                        this.$refs.header.$refs.msg.successFun("Successfully copied!");
                    } else if (this.$root.$refs.msg) {
                        this.$root.$refs.msg.successFun("Successfully copied!");
                    }

                    if (this.$refs.copy) this.$refs.copy.active = 0;
                } catch (err) {
                    console.error('Failed to copy', err);
                }
            } else {
                if (this.$root.$refs.msg) {
                    this.$root.$refs.msg.alertFun("Use https!");
                }
            }
        },
        openCopy(item) {
            this.$root.formData = item;
            if (this.$refs.copy) this.$refs.copy.active = 1;
        },
        openEdit(item) {
            this.$root.formData = item;
        }
    }
}
</script>
