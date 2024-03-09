<template>
  <v-container
    style="padding: 70px; font-family: 'Times New Roman', Times, serif"
  >
    <v-row>
      <v-col cols="12" style="display: flex; justify-content: center">
        <img :src="require('@/assets/logo_big.jpg')" width="87" />
      </v-col>
    </v-row>
    <v-row style="margin-top: 8px; margin-bottom: 32px">
      <v-col cols="12">
        <h1
          style="
            color: #000;
            text-align: center;
            font-size: 30px;
            font-weight: 700;
          "
        >
          Certificat de garantie
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5">
        <span class="black-text">Nume client : </span>
        <span class="black-text">{{ item.name }}</span>
      </v-col>
      <v-col cols="3">
        <span class="black-text">Cod Bare : </span>
        <span class="black-text">{{ item.barcode }}</span>
      </v-col>
      <v-col cols="4">
        <span class="black-text">Model trotineta : </span>
        <span class="black-text">{{ item.model }}</span>
      </v-col>
    </v-row>
    <v-row no-gutters style="margin-top: 24px">
      <v-col cols="12">
        <span class="black-text">Diagnoza : </span>
        <div
          style="
            width: 100%;
            min-height: 150px;
            border: 2px solid #000;
            margin-top: 5px;
          "
        >
          <p style="padding: 10px; text-align: left; white-space: pre-line">
            {{ item.problem }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters style="margin-top: 12px">
      <v-col cols="12">
        <span class="black-text">Operatiuni realizate : </span>
        <div
          style="
            width: 100%;
            min-height: 150px;
            border: 2px solid #000;
            margin-top: 5px;
          "
        >
          <p style="padding: 10px; text-align: left; white-space: pre-line">
            {{ item.notes }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters style="margin-top: 4px">
      <v-col cols="12">
        <span class="black-text">Perioada de garantie manopera - </span>
        <span class="black-text text-uppercase">{{ item.warranty }} zile</span>
      </v-col>
    </v-row>
    <v-row no-gutters style="margin-top: 20px">
      <v-col cols="12">
        <span class="black-text">
          Prezentul certificat reglementează cadrul necesar privind garanția
          produselor de origine, produselor de schimb de origine, produselor
          omologate sau certificate, materialelor de exploatare, așa cum sunt
          definite în OUG 140/2021, materialelor de întreținere și produselor
          recondiționate care sunt destinate vehiculelor rutiere, introduse pe
          piață de SC DOCTORTROTINETA SRL și care sunt comercializate/ distribuite
          către consumatori, denumite în continuare produse/ materiale.
          Produsele comercializate de SC DOCTORTROTINETA SRL sunt interschimbabile
          cu piese originale conform cataloagelor și listelor editate de
          producători. Garanția se aplică în conformitate cu OUG nr140/2021.
        </span>
      </v-col>
    </v-row>
    <v-row no-gutters style="margin-top: 20px">
      <v-col cols="12">
        <p style="font-weight: 700">Aceasta garanție nu acoperă:</p>
        <ul style="font-weight: 700; list-style-type: none; color: #000">
          <li>
            - Defecte cauzate de utilizarea necorespunzătoare sau abuziva.
          </li>
          <li>- Contactul cu apa sau a altor lichide.</li>
          <li>
            - Orice daune cauzate de accidente, coliziuni sau impacturi cu alte
            obiecte.
          </li>
          <li>
            - Modificările sau intervențiile neautorizate asupra produselor.
          </li>
          <li>
            - Produse consumabile cum ar fi camere de aer, cauciucuri exceptând
            defecte de fabricație.
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      justify="space-between"
      style="margin-top: 20px; justify-content: space-between"
    >
      <v-col cols="4">
        <p
          class="black-text"
          style="
            margin-bottom: 0;
            font-weight: 700;
            text-transform: uppercase;
            text-align: center;
          "
        >
          VANZATOR
        </p>
        <p
          class="black-text"
          style="
            margin-bottom: 0;
            font-weight: 700;
            text-transform: uppercase;
            text-align: center;
          "
        >
          DOCTORTROTINETA SRL
        </p>
      </v-col>
      <v-col cols="4">
        <p
          class="black-text"
          style="
            margin-bottom: 0;
            font-weight: 700;
            text-transform: uppercase;
            text-align: center;
          "
        >
          CONSUMATOR
        </p>
        <p
          class="black-text"
          style="
            margin-bottom: 0;
            font-weight: 700;
            text-transform: uppercase;
            text-align: center;
          "
        >
          NUME..........................
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "PdfWarranty",
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format("D.MMM.YYYY");
    },
  },
};
</script>
<style scoped>
.black-text {
  color: #000;
}
.red-text {
  color: #ff0000;
}
.checkbox {
  display: flex;
  align-items: center;
  color: #000;
  line-height: 1;
}
.checkbox::before {
  content: "";
  display: inline-block;
  width: 17px;
  height: 17px;
  margin-right: 10px;
  background: #4299e1;
  border-radius: 3px;
}
.signature {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  column-gap: 20px;
}
</style>
