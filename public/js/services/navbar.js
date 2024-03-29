angular.module('MyApp')
    .factory('NavBar', function ($http, $rootScope, $state, Progression, $compile) {
        var self = this;
        this.createNavBar = function (element, $scope) {
            self.getChapter()
                .then(function (chapter) {
                    var before = '<nav>' +
                        '<div class="nav-overlay"></div>' +
                        '<div class="nav-control"></div>';
                    var parts = "";
                    var after = '</nav>';
                    for (var i = 1, l = chapter.data.slides.length; i <= l; i++) {
                        if (i < $rootScope.currentUser.progress.slide) {
                            parts += '<a data-chapter="' + $rootScope.currentUser.progress.chapter + '" data-slide="' + i + '"><div class="tooltip ft--avenir ft--white">' + chapter.data.slides[(i - 1)].title + '</div></a>'
                        }
                        if ($rootScope.currentUser.progress.slide == i) {
                            parts += '<a class="active" data-chapter="' + $rootScope.currentUser.progress.chapter + '" data-slide="' + i + '"><div class="tooltip ft--avenir ft--white">' + chapter.data.slides[(i - 1)].title + '</div></a>'
                        }
                        if (i > $rootScope.currentUser.progress.slide) {
                            parts += '<a class="disabled"><div class="tooltip ft--avenir ft--white">' + chapter.data.slides[(i - 1)].title + '</div></a>'
                        }
                    }
                    var nav = angular.element(before + parts + after);
                    element.append(nav);
                    self.initEvent();
                });
        }

        this.getChapter = function () {
            return $http({
                    method: 'GET',
                    url: "/chapter/" + $rootScope.currentUser.progress.chapter
                })
                .then(function (chapter) {
                    return chapter.data
                });
        }
        this.initEvent = function () {
            var navControl = angular.element(document.querySelector('.nav-control'));
            var navOverlay = angular.element(document.querySelector('.nav-overlay'));
            var navBar = angular.element(document.querySelector('nav'));
            var links = angular.element(document.getElementsByTagName('a'));
            var seek_bar = angular.element(document.querySelector('.seek-bar'));
            navControl.on('click', function () {
                navBar.toggleClass('up');
                if (seek_bar) {
                    seek_bar.toggleClass("hidep");
                }
            });
            navOverlay.on('click', function () {
                navBar.toggleClass('up');
                if (seek_bar) {
                    seek_bar.toggleClass("hidep");
                }
            });
            links.on('click', function () {
                if (!angular.element(this).hasClass("disabled")) {
                    Progression.goTo(angular.element(this).attr("data-chapter"), angular.element(this).attr("data-slide"));
                }
            });
        }

        return self;
    });
