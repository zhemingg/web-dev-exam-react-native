let _singleton = Symbol();


class MultipleChoiceQuestionServiceClient{

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Singleton!!!');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new MultipleChoiceQuestionServiceClient(_singleton);
        return this[_singleton]
    }

    updateMultipleChoiceQuestion(questionId, question) {
        return fetch ("https://zhemingg-course-manager-react.herokuapp.com/api/multipleChoiceQuestion/" + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    findAllMultipleChoiceQuestionForExam(examId) {
        return fetch("https://zhemingg-course-manager-react.herokuapp.com/api/exam/" + examId + "/multipleChoiceQuestion")
            .then(response => (response.json()))
    }

    createMultipleChoiceQuestion(examId, question) {
        return fetch("https://zhemingg-course-manager-react.herokuapp.com/api/exam/" + examId + "/multipleChoiceQuestion", {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    deleteMultipleChoiceQuestion(questionId){
        return fetch("https://zhemingg-course-manager-react.herokuapp.com/api/baseExamQuestion/" + questionId,{
            method: 'delete'
        }).then(response => (response))
    }


}

export default MultipleChoiceQuestionServiceClient;