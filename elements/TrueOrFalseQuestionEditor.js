import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button, FormLabel, FormInput, CheckBox, FormValidationMessage, Text} from 'react-native-elements';
import TrueOrFalseQuestionServiceClient from "../servicesClient/TrueOrFalseQuestionServiceClient";

export default class TrueOrFalseQuestionEditor extends React.Component {
    static navigationOptions = {title: 'TrueOrFalseQuestionEditor'};

    constructor(props) {
        super(props);
        this.state = {
            question: {
                id: '',
                title: '',
                points: '',
                description: '',
                questionType: 'trueOrFalseQuestion',
                isTrue: false
            },
            preview: false,
            type: '',
            examId: '',
        }

        this.TrueOrFalseQuestionServiceClient = TrueOrFalseQuestionServiceClient.instance;
        this.viewMode = this.viewMode.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.saveOrUpdate = this.saveOrUpdate.bind(this);
        this.renderTrueOrFalse = this.renderTrueOrFalse.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        const examId = navigation.getParam("examId");
        const type = navigation.getParam("type");
        const question = navigation.getParam("question");
        this.setState({type});
        this.setState({examId})
        if (type === 'update') {
            this.setState({question})
        }
    }

    saveOrUpdate(type) {
        var ref = this.props.navigation.getParam('findAll');
        if (type === 'create') {
            return this.createQuestion(this.state.question).then(() => ref(this.state.examId))
        } else {
            return this.updateQuestion(this.state.question).then(() => ref(this.state.examId))
        }

    }

    createQuestion(question) {
        return this.TrueOrFalseQuestionServiceClient
            .createTrueOrFalseQuestion(this.state.examId, question);

    }

    updateQuestion(question) {
        return this.TrueOrFalseQuestionServiceClient
            .updateTrueOrFalseQuestion(question.id, question);
    }

    deleteQuestion() {
        if (this.state.question.id !== '') {
            let ref = this.props.navigation.getParam('findAll');
            return this.TrueOrFalseQuestionServiceClient
                .deleteTrueOrFalseQuestion(this.state.question.id).then(() => ref(this.state.examId));
        }
    }

    renderTrueOrFalse() {
        return (
            <View>
                <CheckBox
                    center
                    onPress={
                        () => {
                            let question = this.state.question;
                            question.isTrue = true;
                            this.setState({question})
                            console.log(this.state.question)
                        }
                    }
                    title={'true'}
                    checked={true === this.state.question.isTrue}
                />

                <CheckBox
                    center
                    onPress={
                        () => {
                            let question = this.state.question;
                            question.isTrue = false;
                            this.setState({question})
                        }
                    }
                    title={'false'}
                    checked={false === this.state.question.isTrue}
                />
            </View>
        )
    }

    viewMode(isPreview) {
        if (isPreview) {
            return (

                <View style={{padding: 15}}>
                    <Text h2>Preview</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text h4>{this.state.question.title}</Text>
                        <Text h4>{this.state.question.points} pts</Text>
                    </View>
                    <Text h5 style={{marginTop: 15}}>Description: {this.state.question.description}</Text>
                    {this.renderTrueOrFalse()}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Button title="Cancel" buttonStyle={{backgroundColor: 'red', borderRadius: 10, marginTop: 10}}/>
                        <Button title="Submit"
                                buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}/>
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    <FormLabel>Question Title</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let question = this.state.question;
                        question.title = text;
                        this.setState({question: question})
                    }}
                               placeholder={'Please add title'}
                               backgroundColor="white"
                               value={this.state.question.title}/>
                    <FormValidationMessage>Title is required</FormValidationMessage>

                    <FormLabel>Question Points</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let question = this.state.question;
                        question.points = text;
                        this.setState({question: question})
                    }}
                               placeholder={'Please set points'}
                               backgroundColor="white"
                               value={this.state.question.points}/>
                    <FormValidationMessage>Points are required</FormValidationMessage>

                    <FormLabel>Question Description</FormLabel>
                    <FormInput
                        backgroundColor="white"
                        multiline={true}
                        onChangeText={(text) => {
                            let question = this.state.question;
                            question.description = text;
                            this.setState({question: question})
                        }}
                        placeholder={'Please add description'}
                        backgroundColor="white"
                        value={this.state.question.description}/>
                    <FormValidationMessage>Description is required</FormValidationMessage>

                    {this.renderTrueOrFalse()}

                    <Button title="Delete Question"
                            buttonStyle={{backgroundColor: 'red', borderRadius: 10, marginTop: 10}}
                            onPress={() => {
                                (this.deleteQuestion())
                                this.props.navigation.goBack()
                            }}/>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Button title="Cancel Modify"
                                buttonStyle={{backgroundColor: 'red', borderRadius: 10, marginTop: 10}}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}/>
                        <Button title="Create or Update"
                                buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                                onPress={() => {
                                    this.saveOrUpdate(this.props.navigation.getParam('type'))
                                    this.props.navigation.goBack()
                                }}/>
                    </View>
                </View>
            )
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