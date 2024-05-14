<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class QuestionModel extends CI_Model {

    public function __construct() {

    }

    // Get a single question by slug along with its answers
    public function getQuestionBySlug($slug) {
        // First, get the question details
        $this->db->select('Questions.*, Users.Username');
        $this->db->from('Questions');
        $this->db->join('Users', 'Questions.UserID = Users.UserID', 'left');
        $this->db->where('Questions.QuestionSlug', $slug);
        $questionQuery = $this->db->get();
        $question = $questionQuery->row(); // returns a single row object

        if ($question) {
            // Next, get the answers for this question
            $this->db->select('Answers.*, Users.Username');
            $this->db->from('Answers');
            $this->db->join('Users', 'Answers.UserID = Users.UserID', 'left');
            $this->db->where('Answers.QuestionSlug', $slug);
            $this->db->order_by('Answers.PostDate', 'ASC');
            $answersQuery = $this->db->get();
            $answers = $answersQuery->result_array(); // returns an array of objects

            // Add the answers to the question object
            $question->answers = $answers;
        }

        return $question;
    }


    // Get all questions
    public function getAllQuestions() {
        $this->db->select('Questions.*, Tags.TagName, Users.Username');
        $this->db->from('Questions');
        $this->db->join('QuestionTags', 'Questions.QuestionSlug = QuestionTags.QuestionSlug', 'left');
        $this->db->join('Tags', 'QuestionTags.TagID = Tags.TagID', 'left');
        $this->db->join('Users', 'Questions.UserID = Users.UserID', 'left'); // Join with Users table to get Username
        $this->db->order_by('Questions.PostDate', 'DESC');
        $query = $this->db->get();
        return $query->result_array(); // returns an array of objects
    }

    // Get all questions by tag
    public function getAllQuestionsByTag($tagName) {
        $this->db->select('Questions.*, Tags.TagName, Users.Username');
        $this->db->from('Questions');
        $this->db->join('QuestionTags', 'Questions.QuestionSlug = QuestionTags.QuestionSlug', 'left');
        $this->db->join('Tags', 'QuestionTags.TagID = Tags.TagID', 'left');
        $this->db->join('Users', 'Questions.UserID = Users.UserID', 'left');
        $this->db->where('Tags.TagName', $tagName);
        $this->db->order_by('Questions.PostDate', 'DESC');
        $query = $this->db->get();
        return $query->result_array(); // returns an array of objects
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

    public function vote($userId, $contentType, $contentId, $voteType) {
        // check if the user already voted
        $this->db->where('UserID', $userId);
        $this->db->where('ContentType', $contentType);
        $this->db->where('ContentID', $contentId);
        $existingVote = $this->db->get('Votes')->row();
    
        if ($existingVote) {
            log_message('debug', 'User has already voted: userId=' . $userId . ', contentType=' . $contentType . ', contentId=' . $contentId);
            return false; // stop if already voted
        }
    
        // Insert new vote
        $voteData = [
            'UserID' => $userId,
            'ContentType' => $contentType,
            'ContentID' => $contentId,
            'VoteType' => $voteType,
            'VoteDate' => date('Y-m-d H:i:s')
        ];
        log_message('debug', 'Inserting vote: ' . json_encode($voteData));
        $this->db->insert('Votes', $voteData);
    
        // determine the user and update vote
        if ($contentType == 'question') {
            $this->db->where('QuestionSlug', $contentId);
            $question = $this->db->get('Questions')->row();
            $affectedUserId = $question->UserID;
    
            $this->db->where('QuestionSlug', $contentId);
            if ($voteType == 'upvote') {
                $this->db->set('Upvotes', 'Upvotes+1', FALSE);
            } else {
                $this->db->set('Downvotes', 'Downvotes+1', FALSE);
            }
            $this->db->update('Questions');
        } else if ($contentType == 'answer') {
            $this->db->where('AnswerID', $contentId);
            $answer = $this->db->get('Answers')->row();
            $affectedUserId = $answer->UserID;
    
            $this->db->where('AnswerID', $contentId);
            if ($voteType == 'upvote') {
                $this->db->set('Upvotes', 'Upvotes+1', FALSE);
            } else {
                $this->db->set('Downvotes', 'Downvotes+1', FALSE);
            }
            $this->db->update('Answers');
        }
    
        // update user's rep points
        $this->db->where('UserID', $affectedUserId);
        if ($voteType == 'upvote') {
            $this->db->set('ReputationPoints', 'ReputationPoints+1', FALSE);
        } else {
            $this->db->set('ReputationPoints', 'ReputationPoints-1', FALSE);
        }
        $this->db->update('Users');
    
        return true;
    }  
    
    public function createReply($data) {
        try {
            $replyData = [
                'QuestionSlug' => $data['question_id'],
                'UserID' => $data['user_id'],
                'Body' => $data['body'],
                'PostDate' => date('Y-m-d H:i:s')
            ];
    
            $this->db->insert('Answers', $replyData);
    
            // Check if the insert was successful
            if ($this->db->affected_rows() > 0) {
                // Update the reputation points for the user
                $this->db->where('UserID', $data['user_id']);
                $this->db->set('ReputationPoints', 'ReputationPoints+1', FALSE);
                $this->db->update('Users');
    
                return $this->db->insert_id();
            } else {
                throw new Exception('Failed to insert reply');
            }
        } catch (Exception $e) {
            log_message('error', 'Error in createReply: ' . $e->getMessage());
            return false;
        }
    }
    
}
?>
