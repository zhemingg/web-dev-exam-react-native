let _singleton = Symbol();


class ExamWidgetServiceClient{

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Singleton!!!');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new ExamWidgetServiceClient(_singleton);
        return this[_singleton]
    }

    updateExam(examId, exam) {
        return fetch ("http://localhost:8080/api/exam/" + examId, {
            method: 'put',
            body: JSON.stringify(exam),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    findAllExamForTopic(topicId) {
        return fetch("http://localhost:8080/api/topic/" + topicId + "/exam")
            .then(response => (response.json()))
    }

    createExam(topicId, exam) {
        console.log(exam);
        return fetch("http://localhost:8080/api/topic/" + topicId + "/exam", {
            method: 'post',
            body: JSON.stringify(exam),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    deleteExam(examId){
        return fetch("http://localhost:8080/api/widget/" + examId,{
            method: 'delete'
        }).then(response => (response))
    }


}

export default ExamWidgetServiceClient;