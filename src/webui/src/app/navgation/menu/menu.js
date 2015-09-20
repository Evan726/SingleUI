/**
 * Created by tchen on 7/6/2015.
 */
angular.module('app.nav')
    .directive('navMenu', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'app/navgation/menu/menu.tpl.html',
            controller: ['$scope', '$state', 'CategoryService', function ($scope, $state, CategoryService) {
                $scope.$state = $state;

                $scope.initController = function () {
                    CategoryService.getCategories().then(function (data) {
                        $scope.menus = _.where(data, {ParentId: 0});
                        $scope.menus = _.sortBy($scope.menus, 'DisplayOrder');
                        HandleMenu(data);
                    });

                };

                HandleMenu = function (data) {
                    data = _.filter(data, function (d) {
                        return d.ParentId != 0
                    });
                    for (var i = 0; i < $scope.menus.length; i++) {
                        $scope.menus[i].subMenu = _.filter(data, function (d) {
                            return d.ParentId == $scope.menus[i].Id;
                        });
                        $scope.menus[i].subMenu = _.sortBy($scope.menus[i].subMenu, 'DisplayOrder');
                    }
                };

                $scope.initController();
            }]
        };
    });