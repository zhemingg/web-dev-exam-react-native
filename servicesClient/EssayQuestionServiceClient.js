let _singleton = Symbol();


class EssayQuestionServiceClient{

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Singleton!!!');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new EssayQuestionServiceClient(_singleton);
        return this[_singleton]
    }

    updateEssayQuestion(questionId, question) {
        return fetch ("https://zhemingg-assignment.herokuapp.com/api/essayQuestion/" + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    findAllEssayQuestionForExam(examId) {
        return fetch("https://zhemingg-assignment.herokuapp.com/api/exam/" + examId + "/essayQuestion")
            .then(response => (response.json()))
    }

    createEssayQuestion(examId, question) {
        return fetch("https://zhemingg-assignment.herokuapp.com/api/exam/" + examId + "/essayQuestion", {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    deleteEssayQuestion(questionId){
        return fetch("https://zhemingg-assignment.herokuapp.com/api/baseExamQuestion/" + questionId,{
            method: 'delete'
        }).then(response => (response))
    }


}

export default EssayQuestionServiceClient;