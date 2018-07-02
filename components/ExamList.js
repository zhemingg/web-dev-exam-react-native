import React from 'react';
import {Text, Button, ListItem, Icon} from 'react-native-elements';
import {View} from 'react-native';
import ExamWidgetServiceClient from "../servicesClient/ExamWidgetServiceClient";

export default class ExamList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            exams:[],
            topicId: 1
        }

        this.findAllExamForTopic = this.findAllExamForTopic.bind(this);
        this.deleteExam = this.deleteExam.bind(this);
        this.ExamWidgetServiceClient = ExamWidgetServiceClient.instance;
    }

    componentDidMount() {
        this.setState({topicId: this.props.topicId});
        this.findAllExamForTopic(this.props.topicId);
    }

    findAllExamForTopic(){
        this.ExamWidgetServiceClient
            .findAllExamForTopic(this.props.topicId)
            .then(exams => {
                this.setState({exams})
            })

    }

    deleteExam(id){
        return this.ExamWidgetServiceClient
            .deleteExam(id).then(() => this.findAllExamForTopic())
    }

    render(){
        return (
            <View style={{padding: 15}}>
                <Text h2>Exams</Text>
                {this.state.exams.map(
                    (exam, index) =>(
                        <ListItem
                            key={index}
                            rightIcon = {<Icon name={'delete'} size={30} color='red'
                                               onPress={() => this.deleteExam(exam.id)}/>}
                            title={exam.id}
                            onPress={() => {
                                this.props.navigation.navigate('ExamWidget',
                                    {topicId: this.state.topicId, type: 'update',
                                        findAll:this.findAllExamForTopic,
                                        exam: exam,
                                        id:exam.id}
                                )}}
                        />
                    ))}
                <Button title="Create Exam"
                        onPress={() => this.props.navigation.navigate('ExamWidget',
                            {topicId: this.state.topicId, type: 'create', findAll:this.findAllExamForTopic})}/>
            </View>
        )
    }

}