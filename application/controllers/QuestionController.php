<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class QuestionController extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('QuestionModel');
        $this->load->helper('url');
        // Set the response header to JSON
        $this->output->set_content_type('application/json');

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

    // Display all questions
    public function index() {
        $questions = $this->QuestionModel->getAllQuestions();
        $this->output->set_output(json_encode($questions));
    }

    // Display a single question by slug
    public function view($slug = NULL) {
        $question = $this->QuestionModel->getQuestionBySlug($slug);

        if (empty($question)) {
            $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Question not found']));
        } else {
            $this->output->set_output(json_encode($question));
        }
    }

    // Create a new question
    public function create() {
        // Decode the input JSON
        $input = json_decode(file_get_contents('php://input'), true);
    
        // Validate the input data
        $this->form_validation->set_data($input);
        $this->form_validation->set_rules('title', 'Title', 'required');
        $this->form_validation->set_rules('body', 'Body', 'required');
        $this->form_validation->set_rules('tag_id', 'Tag', 'required|integer');
    
        if ($this->form_validation->run() === FALSE) {
            $errors = [
                'error' => 'Form validation failed',
                'validation_errors' => validation_errors()
            ];
            $this->output->set_status_header(400)->set_output(json_encode($errors));
        } else {
            // Retrieve the user ID from session
            $userId = $this->session->userdata('user_id');
            if (!$userId) {
                $this->output->set_status_header(401)->set_output(json_encode(['error' => 'User not logged in']));
                return;
            }
    
            // Prepare the data for the question
            $postData = [
                'QuestionSlug' => url_title($input['title']),
                'UserID' => $userId,
                'Title' => $input['title'],
                'Body' => $input['body'],
                'PostDate' => date('Y-m-d H:i:s'),
                'Upvotes' => 0,
                'Downvotes' => 0
            ];
    
            // Start a database transaction
            $this->db->trans_start();
    
            // Insert the question
            $this->QuestionModel->createQuestion($postData);
            $questionSlug = $postData['QuestionSlug'];
    
            // Insert the tag association
            $tagID = $input['tag_id'];
            $this->QuestionModel->addQuestionTag($questionSlug, $tagID);
    
            // Complete the transaction
            $this->db->trans_complete();
    
            // Check transaction status
            if ($this->db->trans_status() === FALSE) {
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to create question']));
            } else {
                $this->output->set_status_header(201)->set_output(json_encode(['message' => 'Question created successfully']));
            }
        }
    }    
    

    public function getQuestionsByTag($tagName) {
        $questions = $this->QuestionModel->getAllQuestionsByTag($tagName);
        $this->output->set_output(json_encode($questions));
    }

    // Delete a question
    public function delete($slug) {
        if ($this->QuestionModel->deleteQuestion($slug)) {
            $this->output->set_status_header(200)->set_output(json_encode(['message' => 'Question deleted successfully']));
        } else {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete question']));
        }
    }

    public function vote() {
        $input = json_decode(file_get_contents('php://input'), true);
    
        $userId = isset($input['user_id']) ? $input['user_id'] : '';
        $contentType = isset($input['content_type']) ? $input['content_type'] : '';
        $contentId = isset($input['content_id']) ? $input['content_id'] : '';
        $voteType = isset($input['vote_type']) ? $input['vote_type'] : '';
    
        log_message('debug', 'Received data: userId=' . $userId . ', contentType=' . $contentType . ', contentId=' . $contentId . ', voteType=' . $voteType);
    
        if ($userId && $contentType && $contentId && $voteType && $this->QuestionModel->vote($userId, $contentType, $contentId, $voteType)) {
            $this->output->set_status_header(200)->set_output(json_encode(['message' => ucfirst($voteType) . ' recorded successfully']));
        } else {
            $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Invalid data or you have already voted']));
        }
    }         
    
    public function reply() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
    
            $replyData = [
                'user_id' => isset($input['user_id']) ? $input['user_id'] : '',
                'question_id' => isset($input['question_id']) ? $input['question_id'] : '',
                'body' => isset($input['body']) ? $input['body'] : ''
            ];
    
            if ($replyData['user_id'] && $replyData['question_id'] && $replyData['body']) {
                $replyId = $this->QuestionModel->createReply($replyData);
                if ($replyId !== false) {
                    $this->output->set_status_header(201)->set_output(json_encode(['message' => 'Reply created successfully', 'reply_id' => $replyId]));
                } else {
                    throw new Exception('Failed to create reply');
                }
            } else {
                throw new Exception('Invalid data');
            }
        } catch (Exception $e) {
            log_message('error', 'Error in reply method: ' . $e->getMessage());
            $this->output->set_status_header(500)->set_output(json_encode(['error' => $e->getMessage()]));
        }
    }
    
}
?>
