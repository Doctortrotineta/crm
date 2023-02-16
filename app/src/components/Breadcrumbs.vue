<template>
  <div class="breadcrumb-wrapper">
    <v-breadcrumbs :items="items"></v-breadcrumbs>
    <v-btn color="info" dark class="mr-2" @click="handleSync">
      <v-icon>mdi-sync</v-icon>
      Synchronize
    </v-btn>
    <v-dialog v-model="loading" fullscreen>
      <v-container
        fluid
        fill-height
        style="background-color: rgba(255, 255, 255, 0.5)"
      >
        <v-layout justify-center align-center>
          <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          >
          </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
    <v-snackbar
      v-model="snackBar.enabled"
      timeout="3000"
      :color="snackBar.type"
      top
      right
    >
      {{ snackBar.message }}
    </v-snackbar>
  </div>
</template>

<script>
/**
 * Default admin component for breadcrumbs, will generate automatically hierarchical links from current route.
 * Support hierarchical CRUD structure.
 */
import { IPC_HANDLERS, IPC_FUNCTIONS, STATUSES } from "../modules/constants";

export default {
  data() {
    return {
      loading: false,

      snackBar: {
        type: "default",
        enabled: false,
        message: "",
      },
    };
  },
  computed: {
    items() {
      return this.$route.matched.map((route) => {
        return {
          text: route.meta ? route.meta.title : route.name,
          exact: true,
          to: route.path === "" ? "/admin/dashboard" : route,
        };
      });
    },
  },
  methods: {
    async handleSync() {
      this.loading = true;
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.SYNCHRONIZE,
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
          if (res.status === STATUSES.ERROR) {
            this.snackBar.type = "error";
          } else if (res.status === STATUSES.SUCCESS) {
            this.snackBar.type = "success";
          }
          this.snackBar.enabled = true;
          this.snackBar.message = res.message
            ? res.message
            : "Synchronize Failed!";
        });
      // console.log(status, message);
    },
  },
};
</script>

<style>
.breadcrumb-wrapper {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
