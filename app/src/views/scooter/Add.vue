<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-card style="width: 100%; max-width: 600px">
          <v-card-title class="dialog-title"> Add Scooter </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="formValid"
              lazy-validation
              @submit.prevent="submit"
            >
              <v-container fluid class="px-0">
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      color="primary"
                      label="Name"
                      v-model="form.name"
                      :rules="rules.name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      color="primary"
                      label="Phone Number"
                      v-model="form.phone"
                      :rules="rules.phone"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      color="primary"
                      label="Barcode"
                      v-model="form.barcode"
                      :rules="rules.barcode"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      color="primary"
                      label="Model"
                      v-model="form.model"
                      :rules="rules.model"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      color="primary"
                      label="TERMEN APROXIMATIV"
                      v-model="form.termen"
                      :rules="rules.termen"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      color="primary"
                      label="Serie motor/trotineta"
                      v-model="form.series"
                      :rules="rules.series"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      color="primary"
                      label="Nr Km"
                      v-model="form.km"
                      :rules="rules.km"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      color="primary"
                      label="Type"
                      placeholder="Select a Type"
                      :items="types"
                      v-model="form.type"
                      :rules="rules.type"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      color="primary"
                      label="Codes"
                      :rows="3"
                      v-model="form.codes"
                      :rules="rules.codes"
                      required
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      color="primary"
                      label="Problem"
                      :rows="3"
                      v-model="form.problem"
                      :rules="rules.problem"
                      required
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      color="primary"
                      label="Price"
                      v-model="form.price"
                      :rules="rules.price"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions class="dialog-actions">
            <v-spacer></v-spacer>
            <v-btn color="error" small @click="handleReset"> Reset </v-btn>
            <v-btn
              color="primary"
              small
              @click="addScooter"
              :disabled="!formValid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
import dayjs from "dayjs";
import { IPC_HANDLERS, IPC_FUNCTIONS, STATUSES } from "../../modules/constants";

export default {
  name: "AddScooter",
  components: {},
  data() {
    return {
      items: [],
      form: {
        name: "",
        phone: "",
        barcode: "",
        model: "",
        termen: "",
        series: "",
        km: "",
        type: "",
        problem: "",
        codes: "",
        price: "",
      },
      types: ["Scooter", "Bike"],
      rules: {
        name: [(v) => !!v || "Name is required"],
        phone: [
          (v) => !!v || "Phone Number is required",
          (v) =>
            /^[+]?(\d{10}|\d{11})$/.test(v) ||
            "Phone Number must be a valid 10 or 11 digit number starting with a '+' sign",
        ],
        barcode: [
          (v) => !!v || "Barcode is required",
          (v) => Number.isInteger(Number(v)) || "Barcode must be a number",
          (v) => this.isBarcodeUnique(v) || "Barcode already exists",
        ],
        model: [(v) => !!v || "Model is required"],
        termen: [(v) => !!v || "TERMEN APROXIMATIV is required"],
        series: [(v) => !!v || "Serie motor/trotineta is required"],
        km: [(v) => !!v || "Nr Km is required"],
        type: [(v) => !!v || "Type is required"],
        problem: [(v) => !!v || "Problem is required"],
        codes: [(v) => !!v || "Problem is required"],
        price: [(v) => Number.isInteger(Number(v)) || "Price must be a number"],
      },
      formValid: true,

      snackBar: {
        type: "default",
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
    async getScooterList() {
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_SCOOTER_LIST,
        })
        .then((result) => {
          this.items = result;
        });
    },
    handleReset() {
      this.$emit("close");
      this.$refs.form.resetValidation();
    },
    isBarcodeUnique() {
      return !this.items.some((item) => item.barcode === this.form.barcode);
    },
    async addScooter() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        const data = {
          id: Date.now(),
          ...this.form,
          notes: "",
          doneBy: "",
          statusId: 1,
          createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        };
        console.log(data);
        await window.ipc
          .invoke(IPC_HANDLERS.DATABASE, {
            func: IPC_FUNCTIONS.ADD_SCOOTER,
            data: data,
          })
          .then((response) => {
            this.$router.push({
              path: `/admin/scooter/edit/${response.id}`,
            });
          })
          .catch((error) => {
            this.snackBar.type = "error";
            this.snackBar.enabled = true;
            this.snackBar.message = "Cannot create Scooter";
          });
      }
    },
  },
};
</script>
