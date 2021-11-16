<?php
// pdoインスタンス生成
function getPdoInstance()
{
try{
    $pdo = new PDO('sqlite:./test.db'); //  PDOの引数に(sqlite:データベースのパス)で指定する
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // エラーが起きた時例外を投げる
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ); // 連想配列形式でデータを取得する
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); // 指定した型に合わせる

    return $pdo;
    
    }catch(PDOException $e){
    //echo $e->getMessage();
    exit('エラーが発生しました');
    }
}

function getDb($pdo)
{
    $stmt = $pdo->query("SELECT 
                            i1.name AS name 
                            ,i1.score AS score
                            ,(SELECT count(i2.score)
                                FROM test i2
                                WHERE i1.score < i2.score) + 1 AS rank
                        FROM 
                            test i1
                        WHERE 
                            rank <= 3 
                        ORDER BY 
                            rank");
    $stmts = $stmt->fetchAll();
    return $stmts;
}

$pdo = getPdoInstance();

if($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $score = filter_input(INPUT_POST, 'score');
    $name = trim(filter_input(INPUT_POST, 'name'));
    if($name === '' || $name === 'null' || mb_strlen($name) > 8){
      $name = '名無しさん';
    }
    $stmt = $pdo->prepare("INSERT INTO test (name, score) VALUES (:name, :score)");
    $stmt->bindValue('name', $name, PDO::PARAM_STR);
    $stmt->bindValue('score', $score, PDO::PARAM_STR);
    $stmt->execute();

    exit;
}

$json = getDb($pdo);
$data=json_encode($json);
echo $data;

