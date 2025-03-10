<template>
  <div>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :sort-by="['id']"
          :sort-desc="true"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Scooter List</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" @click="onAddClick">
                Add Scooter
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
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item="{ item }">
            <tr
              :style="{
                'background-color':
                  item.payment === 'Casa' ? 'rgb(245 111 111)' : 'inherit',
                color: item.payment === 'Casa' ? '#fff' : 'inherit',
              }"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.barcode }}</td>
              <td>{{ item.model }}</td>
              <td>{{ item.termen }}</td>
              <td>{{ item.problem }}</td>
              <td>{{ item.price }}</td>
              <td>
                {{
                  item.createdAt
                    ? setDateFormat(item.createdAt)
                    : "Not Available"
                }}
              </td>
              <td>
                {{
                  item.updatedAt
                    ? setDateFormat(item.updatedAt)
                    : "Not Available"
                }}
              </td>
              <td>
                {{
                  item.updatedAt
                    ? setDateFormat(item.finishedAt)
                    : "Not Available"
                }}
              </td>
              <td>
                <v-chip :color="getStatus(item.statusId).color" dark>
                  {{ getStatus(item.statusId).name }}
                </v-chip>
              </td>
              <td>
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
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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

import { IPC_HANDLERS, IPC_FUNCTIONS } from "../../modules/constants";

export default {
  name: "ScooterList",
  components: {
    DeleteDialog,
  },
  data() {
    return {
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
      pagination: { sortBy: "requested", descending: true, rowsPerPage: 10 },
      items: [],

      snackBar: {
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
  mounted() {
    window.ipc.on("DATA_CHANGE", () => {
      this.getScooterList();
    });
  },
  methods: {
    getValue(resource, key) {
      return get(resource, key);
    },
    onSearchInput() {
      this.getScooterList();
    },
    setDateFormat(date) {
      return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
    },
    async getScooterList() {
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_SCOOTER_LIST,
        })
        .then((result) => {
          this.items = result;
        });
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
    async deleteScooter() {
      this.items = this.items.filter(
        (item) => item.id !== this.selectedDeleteItem.id
      );
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.DELETE_SCOOTER,
          data: this.selectedDeleteItem,
        })
        .then(() => {
          this.deleteDialog = false;
        });
    },
  },
};
</script>
