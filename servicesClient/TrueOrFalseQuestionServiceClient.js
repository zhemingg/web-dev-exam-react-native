let _singleton = Symbol();


class TrueOrFalseQuestionServiceClient{

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Singleton!!!');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new TrueOrFalseQuestionServiceClient(_singleton);
        return this[_singleton]
    }

    updateTrueOrFalseQuestion(questionId, question) {
        return fetch ("http://localhost:8080/api/trueOrFalseQuestion/" + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    findAllTrueOrFalseQuestionForExam(examId) {
        return fetch("http://localhost:8080/api/exam/" + examId + "/trueOrFalseQuestion")
            .then(response => (response.json()))
    }

    createTrueOrFalseQuestion(examId, question) {
        return fetch("http://localhost:8080/api/exam/" + examId + "/trueOrFalseQuestion", {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    deleteTrueOrFalseQuestion(questionId){
        return fetch("http://localhost:8080/api/baseExamQuestion/" + questionId,{
            method: 'delete'
        }).then(response => (response))
    }


}

export default TrueOrFalseQuestionServiceClient;