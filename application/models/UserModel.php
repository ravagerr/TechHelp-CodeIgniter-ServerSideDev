<?php

class UserModel extends CI_Model {
    public function __construct() {
        $this->load->database();
    }

    // get user
    public function getUserByID($userID) {
        $this->db->select('Username, JoinDate, ReputationPoints'); 
        $query = $this->db->get_where('Users', array('UserID' => $userID));
        return $query->row_array(); 
    }
    

    // register
    public function createUser($username, $email, $password) {
        $data = [
            'Username' => $username,
            'Email' => $email,
            'PasswordHash' => password_hash($password, PASSWORD_DEFAULT),
            'JoinDate' => date('Y-m-d H:i:s'),
            'ReputationPoints' => 0
        ];
        return $this->db->insert('Users', $data);
    }

    // login
    public function verifyUser($email, $password) {
        $query = $this->db->get_where('Users', array('Email' => $email));
        $user = $query->row();
    
        if ($user && password_verify($password, $user->PasswordHash)) {
            return $user;
        } else {
            return false;
        }
    }
}
