<template>
<div class="home">
  <div class="header">
    <h1>{{formattedDate}}</h1>
    <div class="tools">
      <button @click="deleteEntry()">Delete Entry</button>
      <input type="file" name="photo" @change="fileChanged">
      <button @click="save()">Done</button>
    </div>
  </div>
  <div class="entry">
    <img :src="entry.imagePath">
    <textarea v-model="description"></textarea>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'Entry',
  data() {
    return {
      entry: this.$root.$entry,
      journal: this.$root.$journal,
      description: '',
      file: null,
    }
  },
  created() {
    this.loadData();
  },
  computed: {
    formattedDate() {
      return moment(this.entry.date).format("MMM Do, YYYY");
    }
  },
  methods: {
    loadData() {
      if(this.entry == null || this.entry == {}) {
        //No journal selected, return to journal
        this.$root.$router.push('journal');
      }

      this.description = this.entry.body;
    },
    fileChanged(event) {
      this.file = event.target.files[0];
      this.uploadPicture();
    },
    async deleteEntry() {
      try {
        await axios.delete("/api/entry/" + this.entry._id);
        this.$root.$entry = {};
        this.$root.$router.back();
      } catch (error) {
        console.log(error);
      }
    },
    async uploadPicture() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        this.entry.imagePath = r1.data.path;
        let r2 = await axios.put('/api/entry/' + this.entry._id, this.entry);
        this.entry = r2.data;
      } catch (error) {
        console.log(error);
      }
    },
    async save() {
      try {
        this.entry.body = this.description;
        await axios.put("/api/entry/" + this.entry._id, this.entry);
        this.$root.$entry = {};
        this.$root.$router.back();
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>
<style scoped>
img {
  max-width:500px;
  max-height:200px;
  width: auto;
  height: auto;
}
* {
  font-size: 1em;
  margin: 4px;
  padding: 4px;
}
h1 {
  color: #24347E;
  font-size: 3em;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tools {
  display: flex;
}
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.entry {
  border-radius: 8px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
}
textarea {
  background-color: #fafafa;
  border-color: #fafafa;
  width: 80%;
  min-width: 350px;
  min-height: 150px;
}
</style>
