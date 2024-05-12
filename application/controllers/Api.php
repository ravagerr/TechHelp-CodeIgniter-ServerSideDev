<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function get_data() {
        echo json_encode(array("message" => "It works!"));
    }
}