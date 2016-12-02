var config = {
    "env": ["staging", "lugu", "c3", "aws_sgp"],
    "default_path": {
        "SDK": "/services/com.xiaomi.miui.ad.thrift.service.MiuiAdQueryService/AppConfig",
        "MAX": "/services/com.xiaomi.miui.ad.exchange.thrift.bid.service.MiuiAdExchangeBidService/AppConfig",
        "Query": "/services/com.xiaomi.miui.ad.thrift.service.MiuiAdQueryService/AppConfig",
        "Retrieve": "/services/com.xiaomi.miui.ad.core.common.model.adretrieve.MiuiAdRetrieveService/AppConfig"
    }
};

angular.module('zkView', []).controller('ZKViewController', function($scope, $http) {
    $scope.default_path = Object.keys(config.default_path);
    $scope.path = "";
    $scope.path_tag = "常用环境";
    $scope.key = "";
    $scope.env_list = config.env;
    $scope.cur_env = 0;

    $scope.select_path = function(item) {
        $scope.path = config.default_path[item];
        $scope.path_tag = item;
    };

    $scope.search = function() {
        get_zk_config();
    };

    $scope.change_env = function(index) {
        $scope.cur_env = index;
        get_zk_config();
    };
    
    function get_zk_config() {
        $http.jsonp('http://www.baidu.com').success(function(data) {
            alert(data);
        });
    }
});