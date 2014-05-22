/**
 * sqlCondition 类，用于描述 sql 条件
 * @class sl.sqlCondition
 * @constructor
 */
sl.sqlCondition = function () {
    var sql = sql || '';

    /**
     * where 条件
     * @method where
     * @example sl.sqlCondition.where("1=1");
     * @return sl.sqlCondition 实例
     */
    this.where = function (str) {
        sql += ' where ' + str;
        return this;
    };

    /**
     * and 条件
     * @method and
     * @example sl.sqlCondition.and("1=1");
     * @return sl.sqlCondition 实例
     */
    this.and = function (str) {
        sql += ' and ' + str;
        return this;
    };

    /**
     * or 条件
     * @method or
     * @example sl.sqlCondition.or("1=1");
     * @return sl.sqlCondition 实例
     */
    this.or = function (str) {
        sql += ' or ' + str;
        return this;
    };

    /**
     * getSql 方法，获取拼接后的 sql 语句
     * @method getSql
     * @example sl.sqlCondition.where("1=1").getSql();
     * @return 拼接后的 sql 语句
     */
    this.getSql = function () {
        return sql;
    };
};