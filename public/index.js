/* global Vue, VueRouter, axios */

var SamplePage = {
  template: "#sample-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
    };
  },
  created: function() {
    // created runs when the component is created
    // console.log('outside this');

  },
  methods: {},
  computed: {}
};


var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      people: [],
      newPerson: {name: "", bio: "", bioVisible: true},
      errors: [],
      searchName: "",
      searchBio: ""
    };
  },
  created: function() {
    // created runs when the component is created
    // console.log('outside this');
    // console.log(this);
    axios.get("http://localhost:3000/v1/people").then(function(response) {
      this.people = response.data;
    }.bind(this));
  },
  methods: {
    addPerson: function() {
      // Unirest.post("/v1/people", parameters: {name: "Joey", bio: "something else"})
      // add a new person to the db
      var params = {
        inputName: this.newPerson.name,
        inputBio: this.newPerson.bio
      };
      axios.post("/v1/people", params).then(function(response) {
        this.people.push(response.data);
        this.newPerson = {name: "", bio: "", bioVisible: true};
        this.errors = [];
      }.bind(this)).catch(function(error) {
        console.log(error.response.data.errors);
        this.errors = error.response.data.errors;
      }.bind(this));
      // make an http request to the create action of my people controller
      // with the correct data
      // to add a new person, add the newPerson object to the people array
    },
    removePerson: function(thePerson) {
      // find the index of this particular person
      var index = this.people.indexOf(thePerson);
      // remove them with splice
      this.people.splice(index, 1);
    },
    toggleBioVisible: function(thePerson) {
      // if (thePerson.bioVisible === true) {
      //   thePerson.bioVisible = false;
      // } else {
      //   thePerson.bioVisible = true;
      // }
      thePerson.bioVisible = !thePerson.bioVisible;
      // console.log(thePerson);
    },
    isValidPerson: function(inputPerson) {
      console.log('running isValidPerson');
      var validBio = inputPerson.bio.toLowerCase().includes(this.searchBio.toLowerCase());
      var validName = inputPerson.name.toLowerCase().includes(this.searchName.toLowerCase());
      return validBio && validName;
    }
  },
  computed: {
    sortedPeople: function() {
      // write some logic in here ...
      // return some sort of value
      return this.people.sort(function(person1, person2) {
        var person1Name = person1.name.toLowerCase();
        var person2Name = person2.name.toLowerCase();
        return person1Name.localeCompare(person2Name);
      });
    }
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/sample", component: SamplePage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router
});
