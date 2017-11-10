app.controller('DashCtrl', function($scope, $http,$ionicModal, $ionicPopup, $stateParams) {
    var ndate = $stateParams.ndate;
    var actualDate=null;
    var dYear=2017;

    if(!ndate){
        var now = new Date();
        //actualDate = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
        actualDate = dYear + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
    }else{
        actualDate = ndate;
    }

    //Get week number from date==================
    Date.prototype.getWeekNumber = function(){
        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    };
    //end===========================

    $http.get('sundayschool2018.json').success(function(data){
        $scope.dataSet = data;
        $scope.appDate=actualDate
        $scope.weekNumber=new Date($scope.appDate).getWeekNumber()

        console.log('The current ISO week number is ' + $scope.weekNumber);


        /* get date from 1-52 weeks */
        function dateFromWeek(yearn, weekn){
            var d = (1 + (weekn - 1) * 7);
            return new Date(yearn, 0, d);
        }
        $scope.newDate = dateFromWeek(dYear, $scope.weekNumber);

        $scope.current = $scope.dataSet[$scope.weekNumber];
            $scope.next = function(){
                var i = $scope.getIndex($scope.current.id, 1);
                console.log('New Day of year: ' + i);
                $scope.current = $scope.dataSet[i];
                $scope.newDate = dateFromWeek(dYear, i);
                $scope.weekNumber=i;
            },
            $scope.previous = function(){
                var i = $scope.getIndex($scope.current.id, -1);
                $scope.current = $scope.dataSet[i];
                $scope.newDate = dateFromWeek(dYear, i);
                $scope.weekNumber=i;
            },
            $scope.getIndex = function(currentIndex, shift){
                var len = $scope.dataSet.length;
                return (((currentIndex + shift) + len) % len)
            }

        /*$scope.openDetails = function(data){
            var fullArrayLength = $scope.dataSet.length - 1;
            $scope.dataSet = data;
            var index= $scope.dataSet.indexOf(data);
            $scope.index = index;
            if(fullArrayLength == $scope.index){
                $scope.mydisabled2 = true;
            }else if($scope.index == 0){
                $scope.mydisabled1 = true;
            }else{
                $scope.mydisabled1 = false;
                $scope.mydisabled2 = false;
            }
            var allData = $scope.dataSet[$scope.index];
            $scope.current = allData;
        }*/

        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(){
            $scope.modal.show();
        };
        $scope.closeModal = function(){
            $scope.modal.hide();
        };

    });


    //var date = new Date();





});
