<template>
  <v-card class="mx-auto" style="height: 100%">
    <v-card-title class="success white--text dialog-title">
      TROTINETE IN FINALIZATE
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table :headers="headers" :items="items" :search="search">
        <template v-slot:top>
          <v-row class="ma-1">
            <v-col xs="12" sm="6" md="4">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">
          {{ item.updatedAt ? setDateFormat(item.updatedAt) : "Not Available" }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                color="success"
                class="mr-2"
                @click="onViewClick(item.id)"
                v-bind="attrs"
                v-on="on"
              >
                mdi-eye
              </v-icon>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                color="primary"
                class="mr-2"
                @click="onEditClick(item.id)"
                v-bind="attrs"
                v-on="on"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </template>
      </v-data-table></v-card-text
    >
    <v-snackbar v-model="snackBar.enabled" timeout="3000">
      {{ snackBar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackBar.enabled = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import dayjs from "dayjs";

import { IPC_HANDLERS, IPC_FUNCTIONS } from "../../modules/constants";

export default {
  name: "CompletedList",
  components: {},
  data() {
    return {
      search: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Phone", value: "phone" },
        { text: "Barcode", value: "barcode" },
        { text: "Model", value: "model" },
        { text: "Price", value: "price" },
        { text: "Date", value: "updatedAt" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      items: [],

      snackBar: {
        enabled: false,
        message: "",
      },
    };
  },
  created() {
    this.getScooterList();
  },
  mounted() {
    window.ipc.on("DATA_CHANGE", () => {
      this.getScooterList();
    });
  },
  methods: {
    setDateFormat(date) {
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
    },
    async getScooterList() {
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_SCOOTER_LIST,
          data: 2,
        })
        .then((result) => {
          this.items = result;
        });
    },
    onViewClick(id) {
      this.$router.push({
        path: `/admin/scooter/view/${id}`,
      });
    },
    onEditClick(id) {
      this.$router.push({
        path: `/admin/scooter/edit/${id}`,
      });
    },
  },
};
</script>

<style scoped>
.dialog-title {
  font-size: 16px !important;
  font-weight: 500;
  line-height: 24px;
}
</style>
