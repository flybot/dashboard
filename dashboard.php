<?php
require  'medoo.php';
/**
 * Database parameters 
 */
const DB_NAME 		= "dama86dd4g3vj6";
const DB_SERVER 	= "production-demo.cas2tln5gone.us-east-1.rds.amazonaws.com";
const DB_USER 		= "xumlight";
const DB_PASSWORD 	= "benjaMini1111111";
const DB_PORT 		= 5732;

class Dashboard {
	
	private $db;
	protected $values = [];
	
	public function __construct() {
		
		$this->db = new medoo([
				'database_type' => 'pgsql',
				'database_name' => DB_NAME,
				'server' => DB_SERVER,
				'username' => DB_USER,
				'password' => DB_PASSWORD,
				'charset' => 'utf8',
				'port' => DB_PORT
		]);
		
	}
	
	/**
	 * Extract email hash from $_GET param and find user ID  
	 * @return int user ID
	 */
	public function getUserId()
	{
		if ( empty( $_GET['user'] ) )
			die( "User hash must exist." );
		$user_email = @gzuncompress(pack('H*', $_REQUEST['user']));
		$user = $this->db->get("customers", "*", ['primary_email' => $user_email, "ORDER" => ['id ASC']]);
		if( empty( $user ) ){
			die("User not found");
		}
		return $user['id'];
	}
	
	/**
	 * Load data from get_profit_report function
	 */
	public function getProfitReport($userID) 
	{
		$sth = $this->db->pdo->prepare("SELECT * FROM reporting.get_profit_report(:id, '2015-01-01'::date, '2015-12-31'::date)");
		$sth->bindParam(':id', $userID, PDO::PARAM_INT);
		$sth->execute();
		$rows = $sth->fetchAll(PDO::FETCH_CLASS);
		return $rows;
	}

	//Template functions
	public function set($key, $value) {
		$this->values[$key] = $value;
	}
	public function output($file) {
		if (!file_exists($file)) {
			return "Error loading template file ($file).";
		}
		$output = file_get_contents($file);
	
		foreach ($this->values as $key => $value) {
			$tagToReplace = "[@$key]";
			$output = str_replace($tagToReplace, $value, $output);
		}
	
		return $output;
	}

}

$dash = new Dashboard();
$user = $dash->getUserId();
$rows = $dash->getProfitReport($user);

//prepare view data
if($row[0]->account < 1100) {
	$dash->set( 'income', -$rows[0]->amount );
	$dash->set( 'income_name', $rows[0]->name );
}
else {
	$dash->set( 'income', 0 );
	$dash->set( 'income_name', 'Row not found' );
}


unset($rows[0]);
$spending = [];
foreach ( $rows as $row )
	if ( $row->account > 1100 )
		$spending[] = [ 'name'=>$row->name, 'value'=>$row->amount ];	
$dash->set('spending', json_encode(array_values($spending)));

echo $dash->output('main.tpl');
