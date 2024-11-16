<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="confirm"> 确认 </v-btn>
        <v-btn text @click="cancel"> 取消 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "MessageBox",
  data() {
    return {
      dialog: false,
      title: "",
      message: "",
      resolve: null,
      reject: null,
    };
  },
  methods: {
    show(title, message) {
      this.title = title;
      this.message = message;
      this.dialog = true;

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      this.dialog = false;
      this.resolve(true);
    },
    cancel() {
      this.dialog = false;
      this.reject(false);
    },
  },
};
</script>
