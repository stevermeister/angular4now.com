
<?php
/**
 * Class PaypalIpn
 */
class PaypalIpn{

    private $debug = true;
    private $service;

    /**
     * @throws Exception
     */
    public function createIpnListener(){
        $postData = file_get_contents('php://input');
        $transactionType = $this->getPaymentType($postData);

        $config = Config::get();

        // depending on the type of payment chosen class
        if($transactionType == PaypalTransactionType::TRANSACTION_TYPE_SINGLE_PAY){
            $this->service = new PaypalSinglePayment();
        }
        elseif($transactionType == PaypalTransactionType::TRANSACTION_TYPE_SUBSCRIPTION){
            $this->service = new PaypalSubscription($config);
        }
        else{
            throw new Exception('Wrong payment type');
        }

        $raw_post_data = file_get_contents('php://input');

        $raw_post_array = explode('&', $raw_post_data);
        $myPost = array();
        foreach ($raw_post_array as $keyval) {
            $keyval = explode ('=', $keyval);
            if (count($keyval) == 2)
                $myPost[$keyval[0]] = urldecode($keyval[1]);
        }

        $customData = $customData = json_decode($myPost['custom'],true);
        $userId = $customData['user_id'];

        // read the post from PayPal system and add 'cmd'
        $req = 'cmd=_notify-validate';
        if(function_exists('get_magic_quotes_gpc')) {
            $get_magic_quotes_exists = true;
        }
        else{
            $get_magic_quotes_exists = false;
        }


        foreach ($myPost as $key => $value) {
            if($get_magic_quotes_exists == true && get_magic_quotes_gpc() == 1) {
                $value = urlencode(stripslashes($value));
            } else {
                $value = urlencode($value);
            }
            $req .= "&$key=$value";
        }

        $myPost['customData'] = $customData;

        $paypal_url = 'https://www.sandbox.paypal.com/cgi-bin/websc';
        //$paypal_url = 'https://www.paypal.com/cgi-bin/websc';

        // IPN authentication request
        $res = $this->sendRequest($paypal_url,$req);

        // Inspect IPN validation result and act accordingly
        // Split response headers and payload, a better way for strcmp
        $tokens = explode("\r\n\r\n", trim($res));
        $res = trim(end($tokens));

        /**/
        if (strcmp ($res, "VERIFIED") == 0) {
            // further processing the request
            $this->service->processPayment($myPost);
        } else if (strcmp ($res, "INVALID") == 0) {
            // request fails the test
            self::log([
                'message' => "Invalid IPN: $req" . PHP_EOL,
                'level' => self::LOG_LEVEL_ERROR
            ], $myPost);
        }
        /**/
    }

    private function sendRequest($paypal_url,$req){
        $debug = $this->debug;

        $ch = curl_init($paypal_url);
        if ($ch == FALSE) {
            return FALSE;
        }
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $req);

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
        if($debug == true) {
            curl_setopt($ch, CURLOPT_HEADER, 1);
            curl_setopt($ch, CURLINFO_HEADER_OUT, 1);
        }

        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);

        //pass header, specify User-Agent - the name of the application. It is necessary to work in live mode
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close', 'User-Agent: ' . $this->projectName));

        $res = curl_exec($ch);
        curl_close($ch);

        return $res;
    }

    public function getPaymentType($rawPostData){
        $post = $this->getPostFromRawData($rawPostData);

        if(isset($post['subscr_id'])){
            return "subscr_payment";
        }
        else{
            return "web_accept";
        }
    }

    /**
     * @param $raw_post_data
     * @return array
     */
    public function getPostFromRawData($raw_post_data){
        $raw_post_array = explode('&', $raw_post_data);
        $myPost = array();
        foreach ($raw_post_array as $keyval) {
            $keyval = explode ('=', $keyval);
            if(count($keyval) == 2)
                $myPost[$keyval[0]] = urldecode($keyval[1]);
        }

        return $myPost;
    }
}
?>



<?php
function processPayment($myPost){

    $customData = json_decode($myPost['custom'],true);
    $userId = $customData['user_id'];
    $productId = $customData['product_id'];

    //
    $userService = new UserService();
    $userInfo = $userService->getUserData($userId);

    //obtain information about the transaction from the database
    $transactionService = new TransactionService();
    $transaction = $transactionService->getTransactionById($myPost['txn_id']);

    if($transaction === null){
        //We obtain product information from the database
        $productService = new ProductService();
        $product = $productService->getProductById($productId);

        // validate the transaction
        if($this->validateTransaction($myPost,$product)){
            // the payment was successful. keep transaction in the database.
            $transactionService->createTransaction($myPost);

            // Perform any other actions
        }
        else{
            // payment failed validation. You need to check manually
        }
    }
    else{
        //duplicate, this transaction we have already processed. do nothing
    }
}
?>


<?php
function validateTransaction($myPost,$product){
    $valid = true;

    /*
     * Checking price matching
     */
    if($product->getTotalPrice($myPost['quantity']) != $myPost['payment_gross']){
        $valid = false;
    }
    /*
     * Check for zero price
     */
    elseif($myPost['payment_gross'] == 0){
        $valid = false;
    }
    /*
     * Check your payment status
     */
    elseif($myPost['payment_status'] !== 'Completed'){
        $valid = false;
    }
    /*
     * Check Payee
     */
    elseif($myPost['receiver_email'] != 'YOUR PAYPAL ACCOUNT'){
        $valid = false;
    }
    /*
     * Currency verification
     */
    elseif($myPost['mc_currency'] != 'USD'){
        $valid = false;
    }

    return $valid;
}
?>