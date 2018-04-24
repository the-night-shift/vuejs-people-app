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
      searchBio: "",
      sortAttribute: "name",
      sortAsc: false
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
    },
    setSortAttribute: function(inputAttribute) {
      this.sortAttribute = inputAttribute;
      // switch the sort order from true to false, or false to true
      // if (this.sortAsc === true) {
      //   this.sortAsc = false;
      // } else {
      //   this.sortAsc = true;
      // }
      this.sortAsc = !this.sortAsc;
    },
    setMarker: function(thePlace, theMap) {
      console.log('in the loop');
      var contentString = thePlace.description;

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var marker = new google.maps.Marker({
        position: {lat: thePlace.latitude, lng: thePlace.longitude},
        map: theMap,
        title: 'Uluru (Ayers Rock)'
      });

      marker.addListener('click', function() {
        infowindow.open(theMap, marker);
      });
    }
  },
  computed: {
    sortedPeople: function() {
      // write some logic in here ...
      // return some sort of value
      return this.people.sort(function(person1, person2) {
        var person1Attribute = person1[this.sortAttribute].toLowerCase();
        var person2Attribute = person2[this.sortAttribute].toLowerCase();
        if (this.sortAsc) {
          return person1Attribute.localeCompare(person2Attribute);
        } else {
          return person2Attribute.localeCompare(person1Attribute);
        }
      }.bind(this));
    }
  },
  mounted: function() {
    var uluru = {lat: -5.363, lng: 31.044};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });

    var places = [
      {latitude: 33.3, longitude: 44.4, description: "somethingsomething"},
      {latitude: 80.3, longitude: -44.4, description: "second marker"},
      {latitude: -33.3, longitude: 144.4, description: "third marker"}
    ];

    for (var i = 0; i < places.length; i++) {
      this.setMarker(places[i], map);
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
