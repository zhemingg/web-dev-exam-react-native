import React from 'react';
import {ScrollView, View, TextInput, Alert} from 'react-native';
import {Text, Button, FormLabel, FormInput, ListItem, FormValidationMessage} from 'react-native-elements';
import ExamWidgetServiceClient from "../servicesClient/ExamWidgetServiceClient";
import QuestionTypePicker from './QuestionTypePicker';
import BaseExamQuestionServiceClient from "../servicesClient/BaseExamQuestionServiceClient";

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
            },
            curQuestionType: '0',
            swapIndex: -1
        }
        this.ExamWidgetServiceClient = ExamWidgetServiceClient.instance;
        this.BaseExamQuestionServiceClient = BaseExamQuestionServiceClient.instance;
        this.viewMode = this.viewMode.bind(this);
        this.saveExam = this.saveExam.bind(this);
        this.updateExam = this.updateExam.bind(this);
        this.saveOrUpdate = this.saveOrUpdate.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.setCurQuestionType = this.setCurQuestionType.bind(this);
        this.addQuestionView = this.addQuestionView.bind(this);
        this.findAllQuestionsForExam = this.findAllQuestionsForExam.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);

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
                questions: [],
                widgetType: 'exam'
            }
            this.setState({exam});
            this.findAllQuestionsForExam(tempExam.id);

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
        return this.ExamWidgetServiceClient
            .updateExam(exam.id, exam);

    }

    findAllQuestionsForExam(examId) {
        return this.BaseExamQuestionServiceClient
            .findAllBaseExamQuestionForExam(examId).then(
                response => {
                    let exam = this.state.exam;
                    exam.questions = response;
                    this.setState({exam})
                }
            );
    }

    addQuestion(questionType) {
        if (questionType === '0') {
            Alert.alert('Please choose question type');
        } else if (questionType === 'MC') {
            this.props.navigation.navigate('MultipleChoiceQuestionEditor', {
                type: 'create',
                examId: this.state.exam.id,
                findAll: this.findAllQuestionsForExam
            })
        } else if (questionType === 'TF') {
            this.props.navigation.navigate('TrueOrFalseQuestionEditor', {
                type: 'create',
                examId: this.state.exam.id,
                findAll: this.findAllQuestionsForExam
            })

        } else if (questionType === 'FB') {
            this.props.navigation.navigate('FillInTheBlankQuestionEditor', {
                type: 'create',
                examId: this.state.exam.id,
                findAll: this.findAllQuestionsForExam
            })

        } else {
            this.props.navigation.navigate('EssayQuestionEditor', {
                type: 'create',
                examId: this.state.exam.id,
                findAll: this.findAllQuestionsForExam
            })
        }
    }

    addQuestionView(type) {
        if (type === 'update') {
            return (
                <View>
                    <QuestionTypePicker setQuestionType={this.setCurQuestionType}/>
                    <Button title="Add a question"
                            buttonStyle={{backgroundColor: 'orange', borderRadius: 10, marginTop: 10}}
                            onPress={() => this.addQuestion(this.state.curQuestionType)}/>
                </View>
            )
        }
    }

    setCurQuestionType(curQuestionType) {
        this.setState({curQuestionType});
    }

    renderQuestions() {
        return (
            <View>
                {
                    this.state.exam.questions.map(
                        (question, index) => {
                            if (question.questionType === 'essayQuestion') {
                                return (
                                    <ListItem
                                        leftIcon={{name: 'subject'}}
                                        title={question.title} key={index}
                                        onPress = {() => this.props.navigation.navigate('EssayQuestionEditor', {
                                            type: 'update',
                                            examId: this.state.exam.id,
                                            question: question,
                                            findAll: this.findAllQuestionsForExam
                                        })}/>
                                )
                            }

                            if (question.questionType === 'multipleChoiceQuestion') {
                                return (
                                    <ListItem
                                        leftIcon={{name: 'list'}}
                                        title={question.title} key={index}
                                        onPress = {() => this.props.navigation.navigate('MultipleChoiceQuestionEditor', {
                                            type: 'update',
                                            examId: this.state.exam.id,
                                            question: question,
                                            findAll: this.findAllQuestionsForExam
                                        })}
                                    />

                                )
                            }

                            if (question.questionType === 'fillInTheBlankQuestion') {
                                return (
                                    <ListItem
                                        leftIcon={{name: 'code'}}
                                        title={question.title} key={index}
                                        onPress = {() => this.props.navigation.navigate('FillInTheBlankQuestionEditor', {
                                            type: 'update',
                                            examId: this.state.exam.id,
                                            question: question,
                                            findAll: this.findAllQuestionsForExam
                                        })}/>
                                )
                            }


                            if (question.questionType === 'trueOrFalseQuestion') {
                                return (
                                    <ListItem
                                        leftIcon={{name: 'check'}}
                                        title={question.title} key={index}
                                        onPress = {() => this.props.navigation.navigate('TrueOrFalseQuestionEditor', {
                                            type: 'update',
                                            examId: this.state.exam.id,
                                            question: question,
                                            findAll: this.findAllQuestionsForExam
                                        })}/>
                                )
                            }

                        })
                }
            </View>
        )
    }



    viewMode(isPreview) {
        if (isPreview) {
            return (
                <View style={{padding:15}}>
                    <Text h2>Preview</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text h4>{this.state.exam.title}</Text>
                        <Text h4>{this.state.exam.points} pts</Text>
                    </View>
                    <Text h5 style={{marginTop: 15}}>Description: {this.state.exam.description}</Text>
                    {this.renderQuestions()}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Button title="Cancel"  buttonStyle={{backgroundColor: 'red', borderRadius: 10, marginTop: 10}}/>
                        <Button title="Submit"  buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}/>
                    </View>
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
                               backgroundColor="white"
                               value={this.state.exam.title}/>
                    <FormValidationMessage>Title is required</FormValidationMessage>

                    <FormLabel>Exam Points</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let exam = this.state.exam;
                        exam.points = text;
                        this.setState({exam: exam})
                    }}
                               placeholder={'Please set points'}
                               backgroundColor="white"
                               value={this.state.exam.points}/>
                    <FormValidationMessage>Points are required</FormValidationMessage>

                    <FormLabel>Exam Description</FormLabel>
                    <FormInput
                        backgroundColor="white"
                        multiline={true}
                        onChangeText={(text) => {
                            let exam = this.state.exam;
                            exam.description = text;
                            this.setState({exam: exam})
                        }}
                        placeholder={'Please add description'}
                        value={this.state.exam.description}/>
                    <FormValidationMessage>Description is required</FormValidationMessage>

                    {this.renderQuestions()}
                    {this.addQuestionView(this.state.type)}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Button title="Create or Update"
                                buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                                onPress={() => {
                                    this.saveOrUpdate(this.state.type)
                                        .then(this.props.navigation.goBack())
                                }
                                }/>
                        <Button title="Cancel Modify"
                                buttonStyle={{backgroundColor: 'red', borderRadius: 10, marginTop: 10}}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}/>
                    </View>
                </View>
            );
        }
    }


    render() {
        return (
            <ScrollView style={{margin: 15}}>
                <Button title="Preview"
                        buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                        onPress={() => this.setState({preview: !this.state.preview})}/>
                {this.viewMode(this.state.preview)}
            </ScrollView>
        )
    }


}