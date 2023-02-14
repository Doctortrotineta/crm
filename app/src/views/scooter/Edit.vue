<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-card style="width: 100%; max-width: 600px">
          <v-card-title class="dialog-title"> Edit Scooter </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
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
                      v-mask="'##########'"
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
                    <v-textarea
                      color="primary"
                      label="Notes"
                      :rows="3"
                      v-model="form.notes"
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      color="primary"
                      label="Price"
                      v-model="form.price"
                      :rules="rules.price"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      color="primary"
                      label="Status"
                      placeholder="Select a Status"
                      :items="status"
                      v-model="form.statusId"
                      item-text="title"
                      item-value="id"
                      :rules="rules.status"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" v-if="form.statusId > 1">
                    <v-text-field
                      color="primary"
                      label="Done By"
                      v-model="form.doneBy"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <div class="signature-wrapper" v-if="form.signature">
                      <span class="text-caption">Signature</span>
                      <div class="signature-img">
                        <v-btn
                          x-small
                          icon
                          color="white"
                          class="close-btn"
                          style="background: #ff5252"
                          @click="removeSignature()"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-img
                          :src="
                            checkStatus()
                              ? signature
                              : `file://${this.form.filePath}`
                          "
                          alt="signature"
                          max-height="150"
                          max-width="120"
                        ></v-img>
                      </div>
                    </div>
                    <vuetify-upload
                      v-else
                      :max="1"
                      can-delete
                      accept="image/*"
                      color="accent"
                      v-model="images"
                    ></vuetify-upload>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions class="dialog-actions">
            <v-spacer></v-spacer>
            <v-btn color="success" small @click="handlePrint">
              Print PDF
            </v-btn>
            <v-btn color="primary" small @click="updateScooter"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <VueHtml2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="download"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="100%"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <pdf-content :item="form" />
      </section>
    </VueHtml2pdf>
    <v-snackbar
      v-model="snackBar.enabled"
      timeout="3000"
      :color="snackBar.type"
      top
      right
    >
      {{ snackBar.message }}
    </v-snackbar>
    <confirm-dialog
      v-model="confirmDialog"
      @cancel="confirmDialog = false"
      @confirm="sendSMS"
    />
  </div>
</template>

<script>
import ConfirmDialog from "./ConfirmDialog.vue";

import PdfContent from "./PdfContent";
import VueHtml2pdf from "vue-html2pdf";
import axios from "axios";
import dayjs from "dayjs";

import { IPC_HANDLERS, IPC_FUNCTIONS } from "../../modules/constants";

export default {
  name: "EditScooter",
  components: {
    ConfirmDialog,
    PdfContent,
    VueHtml2pdf,
  },
  data() {
    return {
      form: {},
      images: [],
      rules: {
        name: [(v) => !!v || "Name is required"],
        phone: [
          (v) => !!v || "Phone Number is required",
          (v) =>
            (v || "").length >= 10 || "Phone Number must be a 10 digits number",
        ],
        barcode: [
          (v) => !!v || "Barcode is required",
          (v) => Number.isInteger(Number(v)) || "Barcode must be a number",
        ],
        model: [(v) => !!v || "Model is required"],
        termen: [(v) => !!v || "TERMEN APROXIMATIV is required"],
        problem: [(v) => !!v || "Problem is required"],
        price: [(v) => Number.isInteger(Number(v)) || "Price must be a number"],
        status: [(v) => !!v || "Status is required"],
        imageRules: [(v) => v.length > 0 || "This image is required"],
      },
      valid: true,
      status: [
        { id: 1, title: "IN LUCRU" },
        { id: 2, title: "FINALIZAT" },
        { id: 3, title: "IESIT" },
      ],

      confirmDialog: false,

      snackBar: {
        type: "default",
        enabled: false,
        message: "",
      },
    };
  },
  created() {},
  mounted() {
    this.getItem();
  },
  computed: {
    signature() {
      if (this.form.signature) {
        return process.env.VUE_APP_UPLOAD_BASEURL + this.form.signature;
      }
      return null;
    },
  },
  methods: {
    async getItem() {
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_SCOOTER_BY_ID,
          data: this.$route.params.id,
        })
        .then((result) => {
          this.form = result;
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot get scooter item";
        });
    },
    handlePrint() {
      this.$refs.html2Pdf.generatePdf();
    },
    removeSignature() {
      this.form.signature = "";
    },
    checkStatus() {
      window.ipc
        .invoke(IPC_HANDLERS.FILE_SYSTEM, {
          func: IPC_FUNCTIONS.CHECK_SERVER_STATUS,
        })
        .then((response) => {
          console.log(response);
          if (response.statusCode === 200) {
            return true;
          } else {
            return false;
          }
        });
    },
    validatePhoneNumber(phone) {
      const regexp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (phone.match(regexp)) {
        return true;
      }
      return false;
    },
    async sendSMS() {
      if (!this.form.phone && !this.validatePhoneNumber(this.form.phone)) {
        this.snackBar.type = "error";
        this.snackBar.enabled = true;
        this.snackBar.message = "Phone number is not valid!";
        return;
      }
      let message =
        "Buna ziua,\nTrotineta dvs este gata.\nCost " +
        this.form.price +
        "lei!\n\n";
      message += "O zi buna !\n";
      message +=
        "Doctortrotineta.ro\n0723110511\nProgram luni-vineri 08.00-17.00";
      await axios({
        method: "GET",
        url: process.env.VUE_APP_SMSLINK_URL,
        headers: {
          "content-type": "application/octet-stream",
          useQueryString: true,
        },
        params: {
          to: this.form.phone,
          message: message,
          connection_id: process.env.VUE_APP_SMSLINK_CONNECTTION_ID,
          password: process.env.VUE_APP_SMSLINK_PASSWORD,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            const result = res.data.split(";");
            if (result[0] === "ERROR") {
              this.snackBar.type = "error";
              this.snackBar.enabled = true;
              this.snackBar.message = result[2];
            } else {
              this.snackBar.type = "success";
              this.snackBar.enabled = true;
              this.snackBar.message = result[2];
            }
            this.confirmDialog = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Unfortunately not sent SMS to the client";
        });
    },
    updateScooter() {
      this.update = async () => {
        this.form.updatedAt = dayjs().format("YYYY-MM-DD HH:mm:ss");
        await window.ipc
          .invoke(IPC_HANDLERS.DATABASE, {
            func: IPC_FUNCTIONS.UPDATE_SCOOTER,
            data: this.form,
          })
          .then(() => {
            console.log(this.form.statusId);
            if (this.form.statusId === 2) {
              this.confirmDialog = true;
            }
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully update Scooter";
          });
      };

      const isValid = this.$refs.form.validate();
      if (isValid) {
        if (this.images.length) {
          const formData = new FormData();
          formData.append("file", this.images[0].file);
          window.ipc
            .invoke(IPC_HANDLERS.FILE_SYSTEM, {
              func: IPC_FUNCTIONS.CHECK_SERVER_STATUS,
            })
            .then((response) => {
              console.log(response);
              if (response.statusCode === 200) {
                this.$http
                  .post("scooter/uploadSignature", formData, {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                  })
                  .then((response) => {
                    console.log("error");
                    if (response.status === 200) {
                      this.form.signature = response.data.filename;
                      this.images = [];
                      this.update();
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                window.ipc
                  .invoke(IPC_HANDLERS.FILE_SYSTEM, {
                    func: IPC_FUNCTIONS.UPLOAD_SIGNATURE,
                    data: {
                      fileName: this.images[0].file.name,
                      uri: this.images[0].preview,
                    },
                  })
                  .then((response) => {
                    this.form.signature = response.fileName;
                    this.form.filePath = response.filePath;
                    this.images = [];
                    this.update();
                  });
              }
            });
        } else {
          this.update();
        }
      }
    },
  },
};
</script>

<style scoped>
.dialog-title {
  font-size: 18px !important;
  font-weight: 500;
  line-height: 24px;
}
.dialog_actions {
  padding: 10px 16px;
}
.signature-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.signature-img {
  position: relative;
  padding: 10px;
  padding-left: 0;
}
.close-btn {
  position: absolute;
  overflow: hidden;
  z-index: 9999999;
  right: 0;
  top: 0;
}
</style>
