let _singleton = Symbol();


class BaseExamQuestionServiceClient{

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Singleton!!!');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new BaseExamQuestionServiceClient(_singleton);
        return this[_singleton]
    }

    updateBaseExamQuestion(questionId, question) {
        return fetch ("https://zhemingg-course-manager-react.herokuapp.com/api/baseExamQuestion/" + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    findAllBaseExamQuestionForExam(examId) {
        return fetch("https://zhemingg-course-manager-react.herokuapp.com/api/exam/" + examId + "/baseExamQuestion")
            .then(response => (response.json()));
    }

    createBaseExamQuestion(examId, question) {
        return fetch("https://zhemingg-course-manager-react.herokuapp.com/api/exam/" + examId + "/baseExamQuestion", {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    deleteBaseExamQuestion(questionId){
        return fetch("https://zhemingg-course-manager-react.herokuapp.com/api/baseExamQuestion/" + questionId,{
            method: 'delete'
        }).then(response => (response))
    }


}

export default BaseExamQuestionServiceClient;