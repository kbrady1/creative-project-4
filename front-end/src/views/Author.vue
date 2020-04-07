<template>
<div class="home">
  <div class="header">
    <h1>Welcome {{author.name}}</h1>
    <div class="tools">
      <button @click="deleteAccount()">Delete Account</button>
      <button @click="createNewJournal()">Add Journal</button>
    </div>
  </div>
  <div class="journal-section">
    <div class="journal" v-for="s in journals" :key="s.id">
      <h3>{{s.title}}</h3>
      <div>
        <button @click="editJournal(s)">Rename</button>
        <button @click="selectItem(s)">Open</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
  name: 'Author',
  data() {
    return {
      author: this.$root.$author,
      journals: [],
    }
  },
  created() {
    this.getItems();
  },
  methods: {
    async getItems() {
      if(this.author == null || this.author == {}) {
        //No author signed in, return home
        this.returnHome();
      }
      try {
        let response = await axios.get("/api/journal/" + this.author._id);
        this.journals = response.data;
      } catch (error) {
        console.log(error);
        alert("Unable to load journals")
      }
    },
    async deleteAccount() {
      try {
        await axios.delete("/api/author/" + this.author._id);
        this.$root.$author = {};
        this.returnHome();
      } catch (error) {
        console.log(error);
      }
    },
    async createNewJournal() {
      try {
        let title = prompt('Please enter a title:', 'My Journal');
        if(title == null || title == "") {
          return;
        }
        let journal = {'title': title, 'authorId': this.author._id};

        await axios.post("/api/journal", journal);

        //reload journals
        this.getItems();
      } catch (error) {
        console.log(error);
      }
    },
    async editJournal(s) {
      try {
        let title = prompt('Please enter a new title:', s.title);
        if(title == null || title == "") {
          return;
        }
        let journal = {'title': title, 'authorId': this.author._id};

        await axios.put("/api/journal/" + s._id, journal);

        //reload journals
        this.getItems();
      } catch (error) {
        console.log(error);
      }
    },
    selectItem(s) {
      this.$root.$journal = s;
      this.$root.$router.push({ name: 'journal' })
    },
    returnHome() {
      this.$root.$router.push('/');
    }
  }
}
</script>
<style scoped>
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
.journal-section {
  background-color: #fafafa;
  border-radius: 8px;
  min-width: 240px;
  width: 600px;
}
.journal {
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
