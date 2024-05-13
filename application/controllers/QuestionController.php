<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class QuestionController extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('QuestionModel');
        $this->load->helper('url');
        // Load the library to handle HTTP requests more effectively
        $this->load->library('form_validation');
        // Set the response header to JSON
        $this->output->set_content_type('application/json');
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
        $this->form_validation->set_rules('title', 'Title', 'required');
        $this->form_validation->set_rules('body', 'Body', 'required');

        if ($this->form_validation->run() === FALSE) {
            $errors = [
                'error' => 'Form validation failed',
                'validation_errors' => validation_errors()
            ];
            $this->output->set_status_header(400)->set_output(json_encode($errors));
        } else {
            $postData = [
                'QuestionSlug' => url_title($this->input->post('title'), 'dash', TRUE),
                'UserID' => 1, // Assuming a static user ID for example
                'Title' => $this->input->post('title'),
                'Body' => $this->input->post('body'),
                'PostDate' => date('Y-m-d H:i:s'),
                'Upvotes' => 0,
                'Downvotes' => 0
            ];
            if ($this->QuestionModel->createQuestion($postData)) {
                $this->output->set_status_header(201)->set_output(json_encode(['message' => 'Question created successfully']));
            } else {
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to create question']));
            }
        }
    }

    // Delete a question
    public function delete($slug) {
        if ($this->QuestionModel->deleteQuestion($slug)) {
            $this->output->set_status_header(200)->set_output(json_encode(['message' => 'Question deleted successfully']));
        } else {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete question']));
        }
    }
}
?>
