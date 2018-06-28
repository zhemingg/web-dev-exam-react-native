let _singleton = Symbol();
const TOPIC_API_URL = 'https://localhost:8080/api/course/CID/module/MID/lesson/LID/topic';
const TOPIC_DELETE_API_URL = 'https://localhost:8080/api/topic/TOPIC_ID';


export default class AssignmentWidgetServiceClient {

    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Singleton!!!');
    }
    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new AssignmentWidgetServiceClient(_singleton);
        return this[_singleton]
    }

    findAssignmentById(Id){

    }


}
