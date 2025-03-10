<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UserController extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('UserModel');
        $this->load->library('form_validation');

        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Credentials");
        header("Access-Control-Allow-Credentials: true");

        // handle pre-flight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('HTTP/1.1 200 OK');
            exit();
        }
    }
    
    public function getUser($userID) {
        $user = $this->UserModel->getUserByID($userID);
        if ($user) {
            echo json_encode($user);
        } else {
            echo 'User not found';
        }
    }
    

    public function register() {
        // parse json input
        $postData = json_decode(file_get_contents('php://input'), true);

        $this->form_validation->set_data($postData);
        $this->form_validation->set_rules('username', 'Username', 'required');
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email|is_unique[Users.Email]');
        $this->form_validation->set_rules('password', 'Password', 'required');

        if ($this->form_validation->run() === FALSE) {
            $this->output->set_content_type('application/json');
            $this->output->set_output(json_encode([
                'status' => 'error',
                'message' => validation_errors()
            ]));
        } else {
            $result = $this->UserModel->createUser(
                $postData['username'],
                $postData['email'],
                $postData['password']
            );
            if ($result) {
                $this->output->set_content_type('application/json');
                $this->output->set_output(json_encode([
                    'status' => 'success',
                    'message' => 'User registered successfully.'
                ]));
            } else {
                $this->output->set_content_type('application/json');
                $this->output->set_output(json_encode([
                    'status' => 'error',
                    'message' => 'User could not be registered.'
                ]));
            }
        }
    }

    public function checkSession() {
        $userId = $this->session->userdata('user_id');
        log_message('debug', 'User ID: ' . $userId);
    
        if ($userId > 0) {
            $this->output->set_status_header(200);
        } else {
            $this->output->set_status_header(401);
        }
    
        // Always return the userId in a JSON format
        $this->output->set_output(json_encode(["userID" => $userId]));
    }

    public function login() {
        $postData = json_decode(file_get_contents('php://input'), true);
        $email = $postData['email'];
        $password = $postData['password'];
    
        $user = $this->UserModel->verifyUser($email, $password);
        if ($user) {
            $this->load->library('session');
          //  $this->session->set_userdata('logged_in', true);
            $this->session->set_userdata('user_id', $user->UserID);
            $this->session->set_userdata('email', $user->Email);
    
            $this->output->set_content_type('application/json');
            $this->output->set_output(json_encode([
                'status' => 'success',
                'message' => 'Login successful.',
                'userID' => $user->UserID
            ]));
        } else {
            $this->output->set_content_type('application/json');
            $this->output->set_output(json_encode([
                'status' => 'error',
                'message' => 'Invalid email or password.'
            ]));
        }
    }

    public function logout() {
        $this->session->sess_destroy();
        $this->output->set_status_header(200)->set_output(json_encode(['message' => 'Logged out successfully']));
    }
}