import Vue from "vue";
import AdminLayout from "@/layouts/Admin";
import Dashboard from "@/views/dashboard/Dashboard";
import ScooterList from "@/views/scooter/List";
import ScooterAdd from "@/views/scooter/Add";
import ScooterEdit from "@/views/scooter/Edit";
import ScooterView from "@/views/scooter/View";
import Error from "@/views/Error";
import i18n from "../../helpers/i18n";
import store from "../store/index";

/**
 * Error component
 */
Vue.component("Error", Error);

export default {
  path: "/admin",
  redirect: "/admin/dashboard",
  component: AdminLayout,
  meta: {
    title: i18n.t("routes.home"),
  },
  children: [
    {
      path: "/admin/profile",
      name: "profile",
      component: () => import("@/views/profile/Detail"),
      meta: {
        title: i18n.t("routes.profile"),
      },
    },
    {
      path: "/admin/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        title: i18n.t("routes.dashboard"),
      },
    },
    {
      path: "/admin/scooter",
      name: "scooter",
      component: ScooterList,
      meta: {
        title: "Scooters",
      },
    },
    {
      path: "/admin/scooter/add",
      name: "add_scooter",
      component: ScooterAdd,
      meta: {
        title: "Add Scooter",
      },
    },
    {
      path: "/admin/scooter/edit/:id",
      name: "edit_scooter",
      component: ScooterEdit,
      meta: {
        title: "Edit Scooter",
      },
    },
    {
      path: "/admin/scooter/view/:id",
      name: "view_scooter",
      component: ScooterView,
      meta: {
        title: "View Scooter",
      },
    },
    {
      path: "*",
      component: Error,
      meta: {
        title: i18n.t("routes.not_found"),
      },
    },
  ],
  beforeEnter: (to, from, next) => {
    if (store.getters.getTokenId) {
      next();
    } else {
      next({ path: "/login" });
    }
  },
};
