<?php
	/**
     * eagleMysql 类，封装了数据库相关操作
     * @class eagleMysql
     * @constructor
     */
	class eagleMysql {
		private $con = null;

		private $url = null;
		private $dataBase = null;
		private $username = null;
		private $password = null;

		function __construct($url, $dataBase, $username, $password) {
			$this->url = $url;
			$this->dataBase = $dataBase;
			$this->username = $username;
			$this->password = $password;
		}

		/**
		 * 建表
		 * @parmas {Array} tableName 表名
		 * @params {Array} fileIds 数据项 
		 * @method createTable
		 */
		function createTable($tableName, $fileIds) {
			$sql = "CREATE TABLE if not exists " . $tableName . " (ID int NOT NULL AUTO_INCREMENT, ";
			foreach($fileIds as $fileId) {
				if (gettype($fileId) == "array") {
					$sql .= " " . $fileId[0] . " " . $fileId[1] . ", ";
				}
			}
			$sql .= "PRIMARY KEY(ID))";
			mysql_query($sql, $this->con);
		}

		/**
		 * 插入数据
		 * @parmas {Array} tableName 表名
		 * @params {Array} params 数据项 
		 * @method insert
		 */
		function insert($tableName, $params) {
			$sql = "INSERT INTO " . $tableName;
			$keys = '';
			$values = '';
			for ($i = 0; $i < count($params) - 1; ++$i) {
				$kv = $params[$i];
				if (gettype($kv) == "array") {
					$keys .= $kv[0] . ", ";
					$values .= "'" . $kv[1] . "', ";
				}
			}
			$keys .= $params[count($params) - 1][0];
			$values .= "'" . $params[count($params) - 1][1] . "'";
			$sql .= " (" . $keys . ") " . "VALUES (" . $values . ")";
			mysql_query($sql, $this->con);
		}

		/**
		 * 更新数据
		 * @parmas {Array} tableName 表名
		 * @params {Array} params 数据项 
		 * @params {String} condition 条件
		 * @method update
		 */
		function update($tableName, $params, $condition) {
			$sql = "UPDATE " . $tableName . " SET ";
			for ($i = 0; $i < count($params) - 1; ++$i) {
				$kv = $params[$i];
				if (gettype($kv) == "array") {
					$sql .= $kv[0] . " = '" . $kv[1] . "', ";
				}
			}
			$sql .= $params[count($params) - 1][0] . " = '" . $params[count($params) - 1][1] . "' ";
			$sql .= $condition;
			mysql_query($sql, $this->con);
		}

		/**
		 * 删除数据
		 * @parmas {Array} tableName 表名
		 * @params {String} condition 条件
		 * @method delete
		 */
		function delete($tableName, $condition) {
			$sql = "DELETE FROM " . $tableName . " ";
			$sql .= $condition;
			mysql_query($sql, $this->con);
		}

		/**
		 * 查找数据
		 * @parmas {Array} tableName 表名
		 * @params {Array} params 数据项 
		 * @params {String} condition 条件
		 * @method update
		 */
		function select($tableName, $params, $condition) {
			$sql = "SELECT " . " ";
			for ($i = 0; $i < count($params) - 1; ++$i) {
				$sql .= $params[$i] . ", ";
			}
			$sql .= $params[count($params) - 1] . " ";
			$sql .= "FROM " . $tableName . " ";
			$sql .= $condition;
			echo $sql;
			return mysql_query($sql, $this->con);
		}

		/**
	     * 链接数据库
	     * @method connet
	     */
		function connect() {
			$this->con = mysql_connect($this->url, $this->username, $this->password);
			if (!$this->con) {
				die('Could not connect: ' . mysql_error());
			}
			$db_selected = mysql_select_db($this->dataBase, $this->con);
			if (!$db_selected) {
				die ("Can\'t use " . $this->dataBase . " : " . mysql_error());
			}
		}

		/**
	     * 与数据库断开链接
	     * @method disconnect
	     */
		function disconnect() {
			mysql_close($this->con);
			$this->con = null;
		}
	}
?>