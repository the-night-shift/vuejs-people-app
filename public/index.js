/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      people: [],
      newPerson: {name: "", bio: "", bioVisible: true}
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
      // to add a new person, add the newPerson object to the people array
      this.people.push(this.newPerson);
      this.newPerson = {name: "", bio: "", bioVisible: true};
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
    }
  },
  computed: {}
};

var router = new VueRouter({
  routes: [{ path: "/", component: HomePage }],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router
});
