<template>
  <div>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :sort-by="['id']"
          :sort-desc="true"
          :options.sync="options"
          :server-items-length="totalRecords"
          @update:options="getScooterList()"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Scooter List</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2 mr-2" @click="onAddClick">
                Add Scooter
              </v-btn>
              <v-btn color="success" dark class="mb-2" @click="onExportClick">
                Export
              </v-btn>
              <!-- <v-btn color="primary" dark class="mb-2">Import</v-btn> -->
            </v-toolbar>
            <v-row class="ma-1">
              <v-col xs="6" sm="4" md="3">
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
          <template v-slot:[`item.createdAt`]="{ item }">
            {{
              item.createdAt ? setDateFormat(item.createdAt) : "Not Available"
            }}
          </template>
          <template v-slot:[`item.updatedAt`]="{ item }">
            {{
              item.updatedAt ? setDateFormat(item.updatedAt) : "Not Available"
            }}
          </template>
          <template v-slot:[`item.finishedAt`]="{ item }">
            {{
              item.finishedAt ? setDateFormat(item.finishedAt) : "Not Available"
            }}
          </template>
          <template v-slot:[`item.statusId`]="{ item }">
            <v-chip :color="getStatus(item.statusId).color" dark>
              {{ getStatus(item.statusId).name }}
            </v-chip>
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
            <v-tooltip bottom v-if="$store.getters.getRoleId === 1">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  color="red"
                  class="mr-2"
                  @click="onDeleteClick(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </template>
          <template v-slot:item="{ item }">
            <tr
              :style="{
                'background-color': item.special ? 'lightblue' : 'inherit',
              }"
            ></tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-snackbar
      v-model="snackBar.enabled"
      timeout="3000"
      :color="snackBar.type"
      top
      right
    >
      {{ snackBar.message }}
    </v-snackbar>
    <delete-dialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @confirm="deleteScooter"
    />
  </div>
</template>

<script>
import DeleteDialog from "./DeleteDialog.vue";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import * as XLSX from "xlsx";
import get from "get-value";

dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: "ScooterList",
  components: {
    DeleteDialog,
  },
  data() {
    return {
      options: {},
      search: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Phone", value: "phone" },
        { text: "Barcode", value: "barcode" },
        { text: "Model", value: "model" },
        { text: "Termen", value: "termen" },
        { text: "Problem", value: "problem" },
        { text: "Price", value: "price" },
        { text: "Created Date", value: "createdAt" },
        { text: "Updated Date", value: "updatedAt" },
        { text: "Finished Date", value: "finishedAt" },
        { text: "Status", value: "statusId", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      items: [],
      totalRecords: 0,

      snackBar: {
        type: "default",
        enabled: false,
        message: "",
      },

      deleteDialog: false,

      selectedDeleteItem: {},
    };
  },
  created() {
    this.getScooterList();
  },
  mounted() {},
  methods: {
    getValue(resource, key) {
      return get(resource, key);
    },
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
    getStatus(id) {
      switch (id) {
        case 1:
          return {
            id: 1,
            name: "IN LUCRU",
            color: "#1e88e5",
          };

        case 2:
          return {
            id: 2,
            name: "FINALIZAT",
            color: "#4caf50",
          };
        case 3:
          return {
            id: 3,
            name: "IESIT",
            color: "#fb8c00",
          };
        default:
          return {
            id: 1,
            name: "IN LUCRU",
            color: "#1e88e5",
          };
      }
    },
    onAddClick() {
      this.$router.push({
        path: `/admin/scooter/add`,
      });
    },
    onExportClick() {
      this.$http
        .get("scooter/exportExcel", {
          params: {
            search: this.search,
          },
        })
        .then((response) => {
          if (response.data.count > 0) {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(response.data.result);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "download.xlsx");
          }
        })
        .catch((error) => {
          console.log("error->>", error);
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
    onDeleteClick(item) {
      this.selectedDeleteItem = item;
      this.deleteDialog = true;
    },
    deleteScooter() {
      this.$http
        .delete("scooter/" + this.selectedDeleteItem.id)
        .then((response) => {
          if (response.status === 200) {
            this.getScooterList();
            this.deleteDialog = false;
            this.selectedDeleteItem = {};
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully delete Scooter";
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot delete Scooter";
        });
    },
  },
};
</script>
