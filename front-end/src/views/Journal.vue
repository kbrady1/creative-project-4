<template>
<div class="home">
  <div class="header">
    <h1>{{journal.title}}</h1>
    <div class="tools">
      <button @click="deleteJournal()">Delete Journal</button>
      <button @click="createNewEntry()">Add Entry</button>
      <button @click="close()">Close</button>
    </div>
  </div>
  <div class="entry-section">
    <div class="entry" v-for="s in entries" :key="s.id" @click="selectItem(s)">
      <img :src="s.imagePath" />
      <h3>{{formattedDateFor(s)}}</h3>
    </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'Journal',
  data() {
    return {
      author: this.$root.$author,
      journal: this.$root.$journal,
      entries: [],
    }
  },
  created() {
    this.getItems();
  },
  methods: {
    formattedDateFor(s) {
      return moment(s.date).format("MMM Do, YYYY");
    },
    async getItems() {
      if(this.journal == null || this.journal == {}) {
        //No journal selected, return home
        this.$root.$router.push('author');
      }

      try {
        let response = await axios.get("/api/entry/" + this.journal._id);
        this.entries = response.data;
      } catch (error) {
        console.log(error);
        alert("Unable to load entries")
      }
    },
    async deleteJournal() {
      try {
        await axios.delete("/api/journal/" + this.journal._id);
        this.$root.$journal = {};
        this.$root.$router.back();
      } catch (error) {
        console.log(error);
      }
    },
    async createNewEntry() {
      try {
        let entry = {'date': Date.now, 'body': 'Dear Diary...', 'journalId': this.journal._id};

        let response = await axios.post("/api/entry", entry);

        this.$root.$entry = response.data;
        this.$root.$router.push('entry');
      } catch (error) {
        console.log(error);
      }
    },
    selectItem(s) {
      this.$root.$entry = s;
      this.$root.$router.push({ name: 'entry' });
    },
    close() {
      this.$root.$router.back();
    }
  }
}
</script>
<style scoped>
  img {
    width: 80px;
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
  .entry-section {
    background-color: #fafafa;
    border-radius: 8px;
    min-width: 240px;
    width: 300px;
  }
  .entry {
    background-color: #efefef;
    display: flex;
    flex-direction: row;
    vertical-align: baseline;
    justify-content: space-between;
  }
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h3 {
    font-style: italic;
    font-size: 1.5em;
    margin-top: 8px;
    vertical-align: bottom;
  }
</style>
