<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class QuestionModel extends CI_Model {

    public function __construct() {
        
    }

    // Get a single question by slug
    public function getQuestionBySlug($slug) {
        $this->db->where('QuestionSlug', $slug);
        $query = $this->db->get('Questions');
        return $query->row(); // returns a single row object
    }

    // Get all questions
    public function getAllQuestions() {
        $query = $this->db->get('Questions');
        return $query->result_array(); // returns an array of objects
    }

    // Get all questions by tag
    public function getAllQuestionsByTag($tagName) {
        $this->db->select('Questions.*');
        $this->db->from('Questions');
        $this->db->join('QuestionTags', 'Questions.QuestionSlug = QuestionTags.QuestionSlug');
        $this->db->join('Tags', 'QuestionTags.TagID = Tags.TagID');
        $this->db->where('Tags.TagName', $tagName);
        $query = $this->db->get();
        return $query->result_array();
    }

    // Create a new question
    public function createQuestion($data) {
        return $this->db->insert('Questions', $data);
    }

    // Delete a question
    public function deleteQuestion($slug) {
        $this->db->where('QuestionSlug', $slug);
        return $this->db->delete('Questions');
    }
}
?>
