let _singleton = Symbol();


class FillInTheBlankQuestionServiceClient{

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Singleton!!!');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new FillInTheBlankQuestionServiceClient(_singleton);
        return this[_singleton]
    }

    updateFillInTheBlankQuestion(questionId, question) {
        return fetch ("http://localhost:8080/api/fillInTheBlankQuestion/" + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    findAllFillInTheBlankQuestionForExam(examId) {
        return fetch("http://localhost:8080/api/exam/" + examId + "/fillInTheBlankQuestion")
            .then(response => (response.json()))
    }

    createFillInTheBlankQuestion(examId, question) {
        return fetch("http://localhost:8080/api/exam/" + examId + "/fillInTheBlankQuestion", {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    deleteFillInTheBlankQuestion(questionId){
        return fetch("http://localhost:8080/api/fillInTheBlankQuestion/" + questionId,{
            method: 'delete'
        }).then(response => (response))
    }


}

export default FillInTheBlankQuestionServiceClient;