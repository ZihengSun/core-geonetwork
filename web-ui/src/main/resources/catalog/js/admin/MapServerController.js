/*
 * Copyright (C) 2001-2016 Food and Agriculture Organization of the
 * United Nations (FAO-UN), United Nations World Food Programme (WFP)
 * and United Nations Environment Programme (UNEP)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or (at
 * your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 *
 * Contact: Jeroen Ticheler - FAO - Viale delle Terme di Caracalla 2,
 * Rome - Italy. email: geonetwork@osgeo.org
 */

(function() {
  goog.provide('gn_mapserver_controller');


  var module = angular.module('gn_mapserver_controller',
      []);


  /**
   * GnMapServerController provides management interface
   * for mapserver configuration used for geopublication.
   *
   */
  module.controller('GnMapServerController', [
    '$scope', '$http', '$rootScope', '$translate',
    function($scope, $http, $rootScope, $translate) {

      $scope.mapservers = {};
      $scope.mapserverSelected = null;
      $scope.mapserverUpdated = false;
      $scope.mapserverSearch = '';
      $scope.operation = null;

      function loadMapservers() {
        $scope.mapserverSelected = null;
        $http.get('geoserver.publisher?_content_type=json&action=LIST')
          .success(function(data) {
              $scope.mapservers = data != 'null' ? data : [];
            }).error(function(data) {
              // TODO
            });
      }

      $scope.updatingMapServer = function() {
        $scope.mapserverUpdated = true;
      };

      $scope.selectMapServer = function(v) {
        $scope.operation = 'UPDATE_NODE';
        $scope.mapserverUpdated = false;
        $scope.mapserverSelected = v;
      };

      $scope.addMapServer = function() {
        $scope.operation = 'ADD_NODE';
        $scope.mapserverSelected = {
          'id': '',
          'name': '',
          'description': '',
          'adminUrl': '',
          'wmsUrl': '',
          'wfsUrl': '',
          'wcsUrl': '',
          'stylerUrl': '',
          'username': '',
          'password': '',
          'namespaceUrl': '',
          'namespacePrefix': '',
          'pushStyleInWorkspace': ''
        };
      };
      $scope.saveMapServer = function(formId) {

        $http.get('geoserver.publisher?_content_type=json&action=' +
            $scope.operation +
            '&' + $(formId).serialize())
          .success(function(data) {
              loadMapservers();
              $rootScope.$broadcast('StatusUpdated', {
                msg: $translate('mapserverUpdated'),
                timeout: 2,
                type: 'success'});
            })
          .error(function(data) {
              $rootScope.$broadcast('StatusUpdated', {
                title: $translate('mapserverUpdateError'),
                error: data,
                timeout: 0,
                type: 'danger'});
            });
      };

      $scope.resetPassword = null;
      $scope.resetUsername = null;
      $scope.resetMapServerPassword = function() {
        $scope.resetPassword = null;
        $scope.resetUsername = null;
        $('#passwordResetModal').modal();
      };

      $scope.saveNewPassword = function() {
        var params = {action: 'UPDATE_NODE_ACCOUNT',
          id: $scope.mapserverSelected.id,
          username: $scope.resetUsername,
          password: $scope.resetPassword
        };

        $http.post('geoserver.publisher@json', null, {params: params})
          .success(function(data) {
              $scope.resetPassword = null;
              $('#passwordResetModal').modal('hide');
            }).error(function(data) {
              // TODO
            });

      };
      $scope.deleteMapServer = function() {
        $http.get('geoserver.publisher?_content_type=json&action=' +
            'REMOVE_NODE&id=' +
                  $scope.mapserverSelected.id)
          .success(function(data) {
              loadMapservers();
            })
          .error(function(data) {
              $rootScope.$broadcast('StatusUpdated', {
                title: $translate('mapserverDeleteError'),
                error: data,
                timeout: 0,
                type: 'danger'});
            });
      };
      loadMapservers();
    }]);
})();