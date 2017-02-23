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
    $scope.path_tag = $scope.default_path[0];
    $scope.path = config.default_path[$scope.path_tag];
    $scope.key = "";
    $scope.env_list = config.env;
    $scope.cur_env = 0;
    $scope.result_list = [];

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
    $scope.show_content = function(item) {
        item.show = !item.show;
    };
    $scope.copy = function(index) {
        var id = "item_" + index;
        document.getElementById(id).select();
        var res = document.execCommand("Copy", false, null);
        console.log(res);
    };
    $scope.open = function() {
        url = 'http://zkview.d.xiaomi.net/' + 'clusters/' + $scope.env_list[$scope.cur_env] + '/nodes?path=' + escape($scope.path);
        chrome.tabs.create({ url: url });
    };
    $scope.change = function(item) {
        if(item.expend) {
            item.value = [item.raw_value];
        } else {
            item.value = item.raw_value.split(/[;,]/);
        }
        item.expend = !item.expend;
        item.show = true;
    };
    
    function get_zk_config() {
        if($scope.path == null || $scope.key == "") {
            return;
        }
        url = 'http://zkview.d.xiaomi.net/' + 'clusters/' + $scope.env_list[$scope.cur_env] + '/nodes?path=' + escape($scope.path);
        $http.get(url).success(function(response) {
            var regExp = /\<textarea.*?\>([\s\S.]*?)\<\/textarea\>/;
            var res = regExp.exec(response);
            if(res != null) {
                var body = res[1];
                $scope.result_list = body.split('\n').filter(function(element) {
                    return element.toLowerCase().indexOf($scope.key.toLowerCase())!=-1 && !element.startsWith("#") && element.indexOf('=')!=-1;
                }).map(function(element, index, array) {
                    [key, raw_value] = element.split('=');
                    var expend = raw_value.indexOf(',')!=-1 || raw_value.indexOf(';')!=-1;
                    return {
                        canExpend: expend,
                        expend: false,
                        key: key,
                        raw_value: raw_value,
                        value: [raw_value],
                        show: (array.length<=4)
                    }
                });
            } else {
                $scope.result_list = [];
            }
        }).error(function(response) {
            chrome.tabs.create({ url: url });
        });
    }
});