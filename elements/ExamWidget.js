import React from 'react';
import {ScrollView, View, TextInput, Alert} from 'react-native';
import {Text, Button, FormLabel, FormInput, ListItem} from 'react-native-elements';
import ExamWidgetServiceClient from "../servicesClient/ExamWidgetServiceClient";
import QuestionTypePicker from "./QuestionTypePicker";

export default class ExamWidget extends React.Component {
    static navigationOptions = {title: 'ExamWidget'};

    constructor(props) {
        super(props);
        this.state = {
            topicId: "",
            preview: false,
            type: "",
            exam: {
                id: "",
                points: '',
                description: '',
                title: "",
                questions: [],
                widgetType: 'exam'
            }
        }
        this.ExamWidgetServiceClient = ExamWidgetServiceClient.instance;
        this.viewMode = this.viewMode.bind(this);
        this.saveExam = this.saveExam.bind(this);
        this.updateExam = this.updateExam.bind(this);
        this.saveOrUpdate = this.saveOrUpdate.bind(this);

    }

    componentDidMount() {
        const {navigation} = this.props;
        const topicId = navigation.getParam("topicId");
        const type = navigation.getParam("type");
        this.setState({topicId});
        this.setState({type});
        if (type === 'update') {
            let tempExam = navigation.getParam('exam');
            let exam = {
                id: tempExam.id,
                points: tempExam.points,
                description: tempExam.description,
                title: tempExam.title,
                questions: tempExam.questions,
                widgetType: 'exam'
            }
            this.setState({exam});
        }

    }

    saveOrUpdate(type) {
        let ref = this.props.navigation.getParam('findAll');
        if (type === 'create') {
            return this.saveExam(this.state.exam).then(() => ref())

        } else {
            return this.updateExam(this.state.exam).then(() => ref())

        }

    }

    saveExam(exam) {
        return this.ExamWidgetServiceClient
            .createExam(this.state.topicId, exam);
    }

    updateExam(exam) {
        console.log('save-update')
        return this.ExamWidgetServiceClient
            .updateExam(exam.id, exam);

    }


    viewMode(isPreview) {
        if (isPreview) {
            return (
                <View>
                    <Text>Preview</Text>
                    <Text>{this.state.exam.title}</Text>
                    <Text>{this.state.exam.points}</Text>
                    <Text>{this.state.exam.description}</Text>
                    {this.state.exam.questions.map((question, index) => (
                        <ListItem title={'question'} key={index}/>
                    ))}
                </View>
            );
        } else {
            return (
                <View>
                    <FormLabel>Exam Title</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let exam = this.state.exam;
                        exam.title = text;
                        this.setState({exam: exam})
                    }}
                               placeholder={'Please add title'}
                               value={this.state.exam.title}/>

                    <FormLabel>Exam Points</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let exam = this.state.exam;
                        exam.points = text;
                        this.setState({exam: exam})
                    }}
                               placeholder={'Please set points'}
                               value={this.state.exam.points}/>

                    <FormLabel>Exam Description</FormLabel>
                    <TextInput
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(text) => {
                            let exam = this.state.exam;
                            exam.description = text;
                            this.setState({exam: exam})
                        }}
                        placeholder={'Please add description'}
                        value={this.state.exam.description}/>
                    <Button title="Save"
                            onPress={() => {
                                this.saveOrUpdate(this.state.type)
                                    .then(this.props.navigation.goBack())
                            }
                            }/>
                    <QuestionTypePicker/>
                    <Button title="Add a question"
                            onPress={() => (Alert.alert('add question'))}/>
                </View>
            );
        }
    }


    render() {
        return (
            <ScrollView>
                <Button title="Preview"
                        onPress={() => this.setState({preview: !this.state.preview})}/>
                {this.viewMode(this.state.preview)}
            </ScrollView>
        )
    }


}