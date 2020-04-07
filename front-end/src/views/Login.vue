<template>
<div class="home">
  <div class="login-window">
    <input v-model="username" placeholder="Username">
    <input v-model="password" placeholder="Password" type="password">
    <button @click="login()">Login</button>
    <button @click="createNewUser()">Create New User</button>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    async login() {
      try {
        let response = await axios.post("/api/author/login", {
          username: this.username,
          password: this.password
        });

        if(response.status == 200) {
          this.$root.$author = response.data;
          this.$router.push({ name: 'author' })

        } else if (response.status == 403) {
          alert('Invalid username or password, please try again.')
        } else {
          alert('Login failed. please try again.')
        }

      } catch (error) {
        console.log(error);
      }

    },
    async createNewUser() {
      let name = prompt("Please enter your name: ", "")

      if (!(name == null || name == "")) {
        try {
          let response = await axios.post("/api/author/", {
            username: this.username,
            name: name,
            password: this.password
          });

          this.$root.$author = response.data;
          this.$router.push({ name: 'author' })
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Name is required. Please try again.");
      }
    },
  }
}
</script>
<style scoped>
* {
  padding: 4px;
  margin: 8px;
  font-size: 1em;
}
.home {
  justify-content: center;
  align-items: center;
  text-align: center;
}
.login-window {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
}
</style>
