<?php
    /**
     * sqlCondition 类，用于描述 sql 条件
     * @class sqlCondition
     * @constructor
     */
    class sqlCondition {
        private $sql = '';
        
        function add($operation, $str) {
            $this->sql .= " " . $operation . " " . $str;
            return $this;
        }
    
        /**
         * getSql 方法，获取拼接后的 sql 语句
         * @method getSql
         * @return 拼接后的 sql 语句
         */
        function getSql() {
            return $this->sql;
        }
    }
?>