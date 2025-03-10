<template>
  <v-card class="mx-auto" style="height: 100%">
    <v-card-title class="success white--text dialog-title">
      TROTINETE IN FINALIZATE
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalRecords"
        @update:options="getScooterList()"
      >
        <template v-slot:top>
          <v-row class="ma-1">
            <v-col xs="12" sm="6" md="4">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                @input="onSearchInput"
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
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "CompletedList",
  components: {},
  data() {
    return {
      options: {},
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
      totalRecords: 0,

      snackBar: {
        enabled: false,
        message: "",
      },
    };
  },
  created() {
    this.getScooterList();
  },
  methods: {
    onSearchInput() {
      this.getScooterList();
    },
    setDateFormat(date) {
      return dayjs.tz(date, "UTC").format("DD/MM/YYYY HH:mm:ss");
    },
    getScooterList() {
      this.$http
        .get("scooter", {
          params: {
            page: this.options.page,
            sort_by: this.options.sortBy ? this.options.sortBy[0] : null,
            descending: this.options.sortDesc ? this.options.sortDesc[0] : null,
            rows_per_page: this.options.itemsPerPage,
            search: this.search,
            status: 2,
          },
        })
        .then((response) => {
          if (response.data) {
            this.items = response.data.result;
            this.totalRecords = response.data.count;
          }
        })
        .catch((error) => {});
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
