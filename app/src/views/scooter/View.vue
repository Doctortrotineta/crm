<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-card style="width: 100%; max-width: 600px">
          <v-card-title class="dialog-title"> View Scooter </v-card-title>
          <v-card-text>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td class="item-title">Name</td>
                    <td class="item-value">
                      {{ item.name }}
                    </td>
                  </tr>
                  <tr>
                    <td class="item-title">Phone</td>
                    <td class="item-value">{{ item.phone }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Barcode</td>
                    <td class="item-value">{{ item.barcode }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Model</td>
                    <td class="item-value">{{ item.model }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Termen</td>
                    <td class="item-value">{{ item.termen }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Serie motor/trotineta</td>
                    <td class="item-value">{{ item.series }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Nr Km</td>
                    <td class="item-value">{{ item.km }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Type</td>
                    <td class="item-value">{{ item.type }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Codes</td>
                    <td class="item-value">{{ item.codes }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Problem</td>
                    <td class="item-value">{{ item.problem }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Notes</td>
                    <td class="item-value">{{ item.notes }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Price</td>
                    <td class="item-value">{{ item.price }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Solved</td>
                    <td class="item-value">{{ item.solved }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Price</td>
                    <td class="item-value">{{ item.price }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Payment Method</td>
                    <td class="item-value">{{ item.payment }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Status</td>
                    <td class="item-value">
                      <v-chip :color="getStatus(item.statusId).color" dark>
                        {{ getStatus(item.statusId).name }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr v-if="item.statusId == 3">
                    <td class="item-title">Warranty</td>
                    <td class="item-value">{{ item.warranty }} days</td>
                  </tr>
                  <tr v-if="item.statusId > 1">
                    <td class="item-title">Done By</td>
                    <td class="item-value">{{ item.doneBy }}</td>
                  </tr>
                  <tr>
                    <td class="item-title">Signature</td>
                    <td class="item-value">
                      <div v-if="item.signature" class="py-2">
                        <v-img
                          :src="item.signature"
                          alt="signature"
                          max-height="150"
                          max-width="120"
                        ></v-img>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-card-actions class="dialog-actions">
            <v-spacer></v-spacer>
            <v-btn color="success" small @click="handlePrint">
              Print PDF
            </v-btn>
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
      <section slot="pdf-content" v-if="item.statusId == 3">
        <pdf-warranty :item="item" />
      </section>
      <section slot="pdf-content" v-else>
        <pdf-content :item="item" />
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
  </div>
</template>

<script>
import PdfContent from "./PdfContent";
import PdfWarranty from "./PdfWarranty";
import VueHtml2pdf from "vue-html2pdf";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "../../modules/constants";

export default {
  name: "EditScooter",
  components: {
    PdfContent,
    PdfWarranty,
    VueHtml2pdf,
  },
  data() {
    return {
      item: {},
      status: [
        { id: 1, title: "IN LUCRU" },
        { id: 2, title: "FINALIZAT" },
        { id: 3, title: "IESIT" },
      ],

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
  computed: {},
  methods: {
    async getItem() {
      await window.ipc
        .invoke(IPC_HANDLERS.DATABASE, {
          func: IPC_FUNCTIONS.GET_SCOOTER_BY_ID,
          data: this.$route.params.id,
        })
        .then((result) => {
          this.item = result;
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot get scooter item";
        });
    },
    getStatus(id) {
      switch (id) {
        case 1:
          return {
            id: 1,
            name: "IN LUCRU",
            color: "#4caf50",
          };

        case 2:
          return {
            id: 2,
            name: "FINALIZAT",
            color: "#1e88e5",
          };
        case 3:
          return {
            id: 3,
            name: "IESIT",
            color: "#fb8c00",
          };
        default:
          return {
            id: id,
            name: "IN LUCRU",
            color: "#4caf50",
          };
      }
    },
    handlePrint() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
};
</script>
