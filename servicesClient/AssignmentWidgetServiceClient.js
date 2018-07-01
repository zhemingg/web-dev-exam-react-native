let _singleton = Symbol();


class AssignmentWidgetServiceClient{

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Singleton!!!');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new AssignmentWidgetServiceClient(_singleton);
        return this[_singleton]
    }

    updateAssignment(assignmentId, assignment) {
        return fetch ("http://localhost:8080/api/assignment/" + assignmentId, {
            method: 'put',
            body: JSON.stringify(assignment),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    findAllAssignmentForTopic(topicId) {
        return fetch("http://localhost:8080/api/topic/" + topicId + "/assignment")
            .then(response => (response.json()))
    }

    createAssignment(topicId, assignment) {
        return fetch("http://localhost:8080/api/topic/" + topicId + "/assignment", {
            method: 'post',
            body: JSON.stringify(assignment),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()))

    }

    deleteAssignment(assignmentId){
        return fetch("http://localhost:8080/api/assignment/" + assignmentId,{
            method: 'delete'
        }).then(response => (response))
    }


}

export default AssignmentWidgetServiceClient;