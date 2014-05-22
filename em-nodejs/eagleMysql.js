/**
 * eagleMysql 类，mysql 数据库适配器。
 * @class sl.eagleMysql
 * @constructor
 */
sl.eagleMysql = (function() {
    this.mysql = null;
    this.client = null;
    this.dbConfig = null;

    var o = {};

    /**
     * 是否输出调试信息
     * @property debug
     * @type bool
     */
    o.debug = false;

    /**
     * 构造函数，初始化 eagleMysql 类。
     * @parmas {Object} config mysql数据库配置，包括账号，密码，url，库名等。
     * @method init
     */
    o.init = function(config) {
        if (o.debug) {
            console.log("[init eagleMysql]: " + config);
        }

        this.mysql = require('mysql');
        this.dbConfig = config;
    };

    /**
     * 建表
     * @parmas {Array} tables 表数据
     * @method createTables
     */
    o.createTables = function (tables) {
        for (var i = 0, tablesLen = tables.length; i < tablesLen; ++i) {
            var tableName = tables[i].Name;
            var fields = tables[i].Fields;
            var queryStr = 'CREATE TABLE if not exists ' + tableName + 
                         '(ID INT(11) not null AUTO_INCREMENT, ';
            for (var t = 0, fieldsLen = fields.length; t < fieldsLen; ++t) {
                queryStr += fields[t].key + ' ' + fields[t].type + ', ';
            }
            queryStr += 'PRIMARY KEY (id))';
            if (o.debug) {
                console.log("[createTables]: " + queryStr);
            }
            this.client.query(queryStr);
        };
    };

    /**
     * 往表中插入数据
     *
     * @parmas {Array} params 插入操作的相关数据，包括表名，键值等
     * @params {function} callback 回调函数
     *
     * @example var sqlCondtion = new SqlCondition();   <br/>
     * var insertParams = {                             <br/>
     *     table  : 'T_TEST_USER',                      <br/>
     *     keys   : ['USERNAME'],                       <br/>
     *     values : ['testName']                        <br/>
     * };                                               <br/>
     * eagleMysql.insert(insertParams, {                <br/>
     *     success : function (data) {                  <br/>
     *         console.log('success');                  <br/>
     *     },                                           <br/>
     *     error : function (err) {                     <br/>
     *         console.log(err);                        <br/>
     *     }                                            <br/>
     * });                                              <br/>
     *
     * @method insert
     */
    o.insert = function (params, callback) {
        var keyStr = ' ' + params.keys[0] + '=? ';
        for (var i = 1, keysLen = params.keys.length; i < keysLen; ++i) {
            keyStr += ', ' + params.keys[i] + '=? ';
        }
        if (o.debug) {
            console.log("[insert]: " + "INSERT INTO " + params.table + " SET " + keyStr);
        }
        this.client.query('INSERT INTO ' + params.table + ' SET ' + keyStr, params.values, 
            function (err, results, fields) {
                o._doCallback(err, results, fields, callback);
            }
        );
    };

    /**
     * 删除表中指定数据
     *
     * @parmas {Array} params 删除操作的相关数据，包括表名，条件等。
     * @params {function} callback 回调函数
     *
     * @example var sqlCondtion = new SqlCondition();                       <br />
     *  var delParams = {                                                   <br />
     *      table      : 'T_TEST_USER',                                     <br />
     *      conditions : sqlCondtion.where("USERNAME = 'testName'").getSql()<br />
     *  };                                                                  <br />
     *  eagleMysql.delete(delParams, {                                      <br />
     *      success : function (data) {                                     <br />
     *          console.log('success');                                     <br />
     *      },                                                              <br />
     *      error : function (err) {                                        <br />
     *          console.log(err)                                            <br />
     *      },                                                              <br />
     *  });                                                                 <br />
     *
     * @method delete
     */
    o.delete = function (params, callback) {
        if (o.debug) {
            console.log("[delete]: " + "DELETE FROM " + params.table + " " + params.conditions);
        }
        this.client.query('DELETE FROM ' + params.table  + ' ' + params.conditions,
            function (err, results, fields) {
                o._doCallback(err, results, fields, callback);
            }
        );
    };

    /**
     * 更新表中指定数据
     *
     * @parmas {Array} params 更新操作的相关数据，包括表名，条件等。
     * @params {function} callback 回调函数
     *
     * @example var sqlCondtion = new SqlCondition();                           <br />
     *  var updateParams = {                                                    <br />
     *      table  : 'T_TEST_USER',
     *      keys   : ['USERNAME'],                                              <br />
     *      values : ['updateName'],                                            <br />
     *      conditions : sqlCondtion.where("USERNAME = 'testName'").getSql()    <br />
     *  };                                                                      <br />
     *  eagleMysql.update(updateParams, {                                       <br />
     *      success : function (data) {                                         <br />
     *          console.log('success');                                         <br />
     *      },                                                                  <br />
     *      error : function (err) {                                            <br />
     *          console.log(err);                                               <br />
     *      }                                                                   <br />
     *  });                                                                     <br />
     *
     * @method update
     */
    o.update = function (params, callback) {
        var keyStr = ' ' + params.keys[0] + '=? ';
        for (var i = 1, keysLen = params.keys.length; i < keysLen; ++i) {
            keyStr += ', ' + params.keys[i] + '=? ';
        }
        if (o.debug) {
            console.log("[update]: " + "UPDATE " + params.table + " SET " + keyStr + " " + params.conditions);
        }
        this.client.query('UPDATE ' + params.table + ' SET ' + keyStr + ' ' + params.conditions, params.values,
            function (err, results, fields) {
                o._doCallback(err, results, fields, callback);
            }
        );
    };

    /**
     * 检索表中指定数据
     *
     * @parmas {Array} params 更新操作的相关数据，包括表名，条件等。
     * @params {function} callback 回调函数
     *
     * @example var sqlCondtion = new SqlCondition();                                   <br />
     * var selParams = {                                                                <br />
     *     keys       : ['USERNAME'],                                                   <br />
     *     table      : 'T_TEST_USER',                                                  <br />
     *     conditions : sqlCondtion.where("USERNAME = 'updateName'").and('1=1').getSql()<br />
     * };                                                                               <br />
     * eagleMysql.select(selParams, {                                                   <br />
     *     success : function (data) {                                                  <br />
     *         console.log('success');                                                  <br />
     *     },                                                                           <br />
     *     error : function (err) {                                                     <br />
     *         console.log(err)                                                         <br />
     *     },                                                                           <br />
     * });                                                                              <br />
     *                                                                                  
     * @method select
     */
    o.select = function (params, callback) {
        var keyStr = ' ' + params.keys[0] + ' ';
        for (var i = 1, keysLen = params.keys.length; i < keysLen; ++i) {
            keyStr += ', ' + params.keys[i] + ' ';
        }
        if (o.debug) {
            console.log("[update]: " + "SELECT " + keyStr + " FROM " + params.table  + " " + params.conditions);
        }
        this.client.query('SELECT ' + keyStr + ' FROM ' + params.table  + ' ' + params.conditions,
            function (err, results, fields) {
                o._doCallback(err, results, fields, callback);
            }
        );
    };

    /**
     * 链接数据库
     * @method connet
     */
    o.connet = function () {
        this.client = this.mysql.createConnection(this.dbConfig.dbOptions);
        if (o.debug) {
            console.log("[connet]: " + "USE " + this.dbConfig.dataBase);
        }
        this.client.query('USE ' + this.dbConfig.dataBase, function(error, results) {
            if(error) {
                console.log('ClientConnectionReady Error: ' + error.message);
                return;
            }else{
                console.log('ClientConnect Success');
            }
        });
    };

    /**
     * 与数据库断开链接
     * @method disconnect
     */
    o.disconnect = function () {
        this.client.end();
        this.client = null;
    };

    /**
     * 数据库操作通用回调函数
     * @method _doCallback
     * @private
     */
    o._doCallback = function (err, results, fields, callback) {
        if (err) {
            callback.error(err);
        } else {
            data = {
                results : results,
                fields  : fields
            }
            callback.success(data);
        }
    };

    return o;
})();
