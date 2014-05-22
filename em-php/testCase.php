<?php
	include "sqlCondition.php";
	include "eagleMysql.php";

	// 初始化
	$mysql = new eagleMysql("localhost:3306", "my_db", "root", "123456");

	// 链接
	$mysql->connect();

	// 建表
	$fileIds = array(
		array(
			"username",
			"varchar(255)"
		),
		array(
			"password",
			"int(32)"
		),
		array(
			"age",
			"int(32)"
		),
	);
	$mysql->createTable("User", $fileIds);

	// 插入数据
	for ($i = 0; $i < 3; ++$i) {
		$params = array(
			array(
				"username",
				"Sam"
			),
			array(
				"password",
				"123456"
			),
		);
		$mysql->insert("User", $params);
	}
	
	//更新数据
	$params = array(
		array(
			"password",
			"7890"
		),
		array(
			"age",
			"20"
		)
	);

	$sqlCondition = new sqlCondition();
	$condition = $sqlCondition->add("where", "username = 'Sam'")->add("and", "id = '3'")->getSql();

	$mysql->update("User", $params, $condition);

	// 删除数据
	$sqlCondition = new sqlCondition();
	$condition = $sqlCondition->add("where", "username = 'Sam'")->add("and", "id = '2'")->getSql();

	$mysql->delete("User", $condition);

	// 查找数据
	$params = array("username", "age");

	$sqlCondition = new sqlCondition();
	$condition = $sqlCondition->add("where", "username = 'Sam'")->add("and", "id = '3'")->getSql();

	$result = $mysql->select("User", $params, $condition);

	echo "<table border='1'>";
	while($row = mysql_fetch_array($result)) {
		echo "<tr>";
		echo "<td>" . $row['username'] . "</td>";
		echo "<td>" . $row['age'] . "</td>";
		echo "</tr>";
	}
	echo "</table>";

	// 断开链接
	$mysql->disconnect();
?>