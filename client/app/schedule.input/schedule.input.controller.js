'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleInputCtrl', function ($scope, papa, $state) {
    $scope.schedule = null;
    $scope.teamCSV = null;
    $scope.volunteerCSV = null;
    $scope.conflicts = {};
    $scope.unresolvables = 0;
    $scope.detail = null;
    $scope.allVolunteers = [];

    $scope.$parent.schedule.$promise.then(function(schedule) {
      $scope.schedule = schedule;
    });

    $scope.count = function(object) {
      return Object.keys(object).length;
    };

    $scope.open = function(volunteer) {
      $scope.detail = volunteer;
    };

    $scope.close = function() {
      $scope.detail = null;
    };

    $scope.addVolunteer = function() {
      var unassigned = $scope.schedule.unassigned;
      unassigned.unshift({});
      $scope.detail = unassigned[0];
    };

    $scope.removeVolunteer = function(volunteer) {
      var unassigned = $scope.schedule.unassigned;
      for(var i in $scope.schedule.jobs){
        var job = $scope.schedule.jobs[i];
        for(var j in job.slots){
          var slot = job.slots[j];
          for(var k in slot.assigned){
            var aVol = slot.assigned[k];
            console.log(aVol);
            if(aVol == volunteer){
              //lol hi Dan, SCREW YOU, I'M DOING A WINDOW ALERT!
              window.alert(volunteer.name + " is assigned to " + job.name + ". Please unassign volunteer before deleting.");
            }
          }
        }
      }
      unassigned.splice(unassigned.indexOf(volunteer), 1);
    };

    //uploads volunteers
    $scope.process = function(data) {
      if ($scope.volunteerCSV) {
        papa.parse($scope.volunteerCSV, {
          header: true,
          step: function(result) {
            $scope.schedule.unassigned.push(birthVolunteer(result.data[0]));
          },
          complete: function() {
              $scope.$apply();
          }
        });
      }
    };

    //uploads teams
    $scope.processTeams = function(data) {
      console.log("got to processTeams");

      var divisions = {
        Primary: 0, //primary listed as 1's in csv? Error?
        I: 1,
        II: 2,
        III: 3,
        IV: 4
      };

      if ($scope.teamCSV) {
        papa.parse($scope.teamCSV, {
          header: true,
          step: function(result) {
            var row = result.data[0];
            $scope.conflicts['#' + row['Number'] + ' ' + row['Problem'] + '/' + divisions[row['Division']]] = {
              start: moment(row['Longt Time'], 'h:mm A').subtract(15, 'minutes'),
              end: moment(row['Longt Time'], 'h:mm A').add(45, 'minutes'),
              name: "Watching A Performance"
            };

          },
          complete: function() {
            $scope.$apply();
          }
        });
      }
    };

    $scope.addConstraints = function() {
      for(var index in $scope.schedule.unassigned){
        var volunteer = $scope.schedule.unassigned[index];
        if (volunteer.childTeam) {
          var teams = volunteer.childTeam.split(", ");
          teams.forEach(function(team){
            if(team in $scope.conflicts) {
              volunteer.constraints.push($scope.conflicts[team]);
            }
            else {
              $scope.unresolvables++;
            }
          });
        }
      }
    };

    var fullName = function(first, last){
      return [first, last].join(" ");
    };

    var birthVolunteer = function(row) {
      return {
        name: fullName(row["First name"], row["Last name"]),
        email: row["E-mail"],
        phone: row["phone"],
        username: row["username"],
        password: row["password"],
        childTeam: row["child_team"],
        constraints: [],
        comments: row["comment"],
        shirt: row["T-shirt"],
        positions: [],
        isJudge: row[""] == "AS_JUDGE",
        preferences: genPrefs(generatePrefTitle(row["Job Preference #1"]), generatePrefTitle(row["Job Preference #2"]))
      };
    };

    /*
    var genJobs = function(row) {

    }
    */


    var genPrefs = function(pref1, pref2) {
      var arr = [];
      if (!(pref1 === "burg") && pref1 != " " && pref1 != "") {
        arr.push(pref1);
      }
      if (!(pref2 === "burg") && pref1 != pref2 && pref2 != " " && pref2 != "") {
        arr.push(pref2);
      }
      return arr;
    }

    var generatePrefTitle = function(string) {
      if (string.startsWith("Non-Judging")) {
        if(string.substring("Non-Judging".length + 1) != "No Preference") {
          return string.substring("Non-Judging".length + 1);
        }
      } else if (string.endsWith("No Preference")) {
        return string.substring(0, string.length - "No Preference".length);
      }
      return "burg";
    }

    $scope.timeRange = function(constraint) {
      var start = moment(constraint.start);
      var end = moment(constraint.end);

      return start.format('h:mma') + ' to ' + end.format('h:mma');
    };
    



  });
