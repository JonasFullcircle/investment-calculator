var config = {
  apiKey: "AIzaSyBlssml3dUU3lcQnVj4qIUY7MSjlpke03w",
  authDomain: "capitalaccessintl.firebaseapp.com",
  databaseURL: "https://capitalaccessintl.firebaseio.com",
  projectId: "capitalaccessintl",
  storageBucket: "capitalaccessintl.appspot.com",
  messagingSenderId: "432439668274"
};
firebase.initializeApp(config);
let d = new Date()
var timestamp = d.getTime()

var app = new Vue({
  el: '#app',
  mode: 'production',
  data: {
    eligable: false,
    eligableAmount: 0,
    currentStep: 1,
    enterAmount: false,
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    creditScore: [{desc: '499 or below', score: 499}, {desc: '500 - 599', score: 599}, {desc: '600 - 649', score: 649}, {desc: '650 - 679', score: 679}, {desc: '680 - 719', score: 719}, {desc: '720 or above', score: 720}],
    revenueData: [{desc: '$15k - $30k', score: 30000}, {desc: '$30k - $60k', score: 60000}, {desc: '$60k - $120k', score: 120000}, {desc: '$120k - $240k', score: 240000}, {desc: '$240k - $500', score: 500000}, {desc: '$500k+', score: 501000}],
    purposeData: ["Expansion", "Working Capital", "Payroll", "Purchase a Business", "Purchase a Franchise", "Equipment", "Real Estate", "Buy Out a Partner", "Start a Business", "Finance Accountants Receivable", "Other"],
    industryData: ["Agriculture, Forestry, Fishing and Hunting", "Arts, Entertainment, and Recreation", "Adult Entertainment", "Gambling", "Automobile Dealers & Parts", "Construction", "Education", "Finance and Insurance", "Healthcare", "Social Assistance", "IT, Media, or Publishing", "Legal Services", "Mining (except Oil and Gas)", "Oil and Gas Extraction", "Manufacturing", "Political, Governmental, or Public Organizations", "Real Estate", "Religious Organizations", "Restaurants and Food Services", "Retail Stores", "Firearm Sales", "Gas Stations", "Transportation and Warehousing", "Freight Trucking", "Travel Agencies", "Utilities", "Wholesale Trade", "All Others"],
    typeBusiness: ["LLC", "Corporation", "Sole Proprietor", "Legal Partnership"],
    curBal: ["Yes", "No"],
    aboutData: ["Accept Credit Cards", "Had a Bankruptcy", "Is a Franchise", "Invoice Customers", "Non-profit", "Seasonal", "Use Accounting Software"],
    stateData: ["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District Of Columbia","Federated States Of Micronesia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Marshall Islands","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Palau","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
    message: 'Hello Vue!',
    answers: {
      seeking: null,
      credit: 499,
      date: {month: "Choose a month", year: "", started: true},
      revenue: 30,
      industry: 'Choose an industry',
      state: 'Choose a state',
      purpose: [],
      about: [],
      type: 'Other',
      currentAdvance: {bool: false, amount: 0},
      information: {
        name: '',
        mail: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
      },
      eligable: 0
    },
    dateEmpty: true
  },
  mounted() {
    this.industryData.sort()

    firebase.auth().signInWithEmailAndPassword("info@fullcircle-cms.com", "thisisatest").then(function(msg) {
      console.log("Logged In Successfully")
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

  },
  computed: {
    checkDate() {
      if(this.answers.date.month === "Choose a month") return this.dateEmpty = true
      else return this.dateEmpty = false
    }
  },
  methods: {
    goBack() {
      this.currentStep -= 1
    },
    numberEdit(event) {
      if(Number(event.key) >= 0 && Number(event.key) <= '9') {
        var num = this.answers.seeking.replace(/,/gi, "");
        num = num.replace('$', "")
        var num2 = num.split(/(?=(?:\d{3})+$)/).join(",");
        this.answers.seeking = '$' + num2
      }
      else this.answers.seeking = this.answers.seeking.substring(0, this.answers.seeking.length - 1);
    },
    credit(score) {
      this.answers.credit = score
      this.currentStep += 2
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    revenue(score) {
      this.currentStep += 1
      this.answers.revenue = score
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    selectMonth(month) {
      this.answers.date.month = month
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    selectState(state) {
      this.answers.state = state
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    industry(industry) {
      this.answers.industry = industry
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    notStarted() {
      this.answers.date.started = false
      this.currentStep += 1
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    nonApply() {
      this.answers.about = ['Non Apply']
      this.currentStep += 1
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    selectPurpose(purpose) {
      if(this.answers.purpose.length !== 0) {
        let index = this.answers.purpose.indexOf(purpose)
        if(index === -1) this.answers.purpose.push(purpose)
        else this.answers.purpose.splice(index, 1)
      } else this.answers.purpose.push(purpose)
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    currentAdvance(yesno) {
      this.answers.currentAdvance.bool = yesno
      if(yesno === "No") {
        this.currentStep += 1
      }
      else this.enterAmount = true
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    selectType(type) {
      this.answers.type = type
      this.currentStep += 1
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    selectAbout(about) {
      if(this.answers.about.length !== 0) {
        let index = this.answers.about.indexOf(about)
        if(index === -1) this.answers.about.push(about)
        else this.answers.about.splice(index, 1)
      } else this.answers.about.push(about)
      firebase.database().ref("answers/" + timestamp).update(this.answers)
    },
    isValid() {
      firebase.database().ref("answers/" + timestamp).update(this.answers)
      if(this.currentStep === 1) {
        if(this.answers.seeking !== null) this.currentStep += 1
      } else if(this.currentStep === 2) {
        if(this.answers.information.mail !== '') {
          let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(re.test(this.answers.information.mail)) this.currentStep += 1
        }
      } else if(this.currentStep === 4) {
        if(this.answers.date.month !== "Choose a month" && this.answers.date.year !== "") this.currentStep += 1
      } else if(this.currentStep === 6) {
        if(this.answers.industry !== "Choose an industry") this.currentStep += 1
      } else if(this.currentStep === 7) {
        if(this.answers.about.length !== 0) this.currentStep += 1
      } else if(this.currentStep === 8) {
        if(this.answers.state !== "Choose a state") this.currentStep = this.currentStep + 2
      } else if(this.currentStep === 9) {
        if(this.answers.purpose.length !== 0) this.currentStep += 1
      } else if(this.currentStep === 11) {
        if(this.answers.currentAdvance.bool === "Yes" && this.answers.currentAdvance.amount !== 0) this.currentStep += 1
      } else if(this.currentStep === 12) {
        if(this.answers.information.name !== '' && this.answers.information.phone !== '') {
          // console.log(this.answers.credit)
          var eligable = 0
          if(this.answers.credit === 499) { 
            eligable = .5 * this.answers.revenue 
            // console.log("Eligable for $"+ (.5 * this.answers.revenue).toString())
          }
          else if(this.answers.credit === 599) {
            eligable = .65 * this.answers.revenue
            // console.log("Eligable for $"+ (.65 * this.answers.revenue).toString())
          }
          else if(this.answers.credit === 649) {
            eligable = .75 * this.answers.revenue
            // console.log("Eligable for $"+ (.75 * this.answers.revenue).toString())
          }
          else if(this.answers.credit === 679) {
            eligable = .85 * this.answers.revenue
            // console.log("Eligable for $"+ (.85 * this.answers.revenue).toString())
          }
          else if(this.answers.credit === 719) {
            eligable = this.answers.revenue
            // console.log("Eligable for $"+ (this.answers.revenue).toString() )
          }
          else if(this.answers.credit === 720) {
            eligable = 1.2 * this.answers.revenue
            // console.log("Eligable for $" + (1.2 * this.answers.revenue).toString())
          }
          
          if(eligable > this.answers.seeking) this.eligable = true
          else this.eligable = false
          
          this.eligableAmount = eligable
          this.answers.eligable = eligable
          firebase.database().ref("last").update(this.answers)
          this.currentStep += 1
        }
      }
    }
  }
})