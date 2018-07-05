import React from 'react';
import {ScrollView, Text, TextInput, Alert, View} from 'react-native';
import {FormLabel, FormInput, Button, CheckBox, FormValidationMessage, Icon} from 'react-native-elements';
import MultipleChoiceQuestionServiceClient from "../servicesClient/MultipleChoiceQuestionServiceClient";

export default class MultipleChoiceQuestionEditor extends React.Component {
    static navigationOptions = {title: 'MultipleChoiceQuestionEditor'};

    constructor(props) {
        super(props);
        this.state = {
            question: {
                id: '',
                title: '',
                points: '',
                description: '',
                choices: [],
                correctChoice: '',
                questionType: 'multipleChoiceQuestion'
            },
            tempChoice: '',
            preview: false,
            type: '',
            examId: '',

        }
        this.MultipleChoiceQuestionServiceClient = MultipleChoiceQuestionServiceClient.instance;
        this.saveOrUpdate = this.saveOrUpdate.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.setCorrectChoice = this.setCorrectChoice.bind(this);
        this.renderChoice = this.renderChoice.bind(this);
        this.viewMode = this.viewMode.bind(this);
        this.checkValidOfChoice = this.checkValidOfChoice.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this)
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
        return this.MultipleChoiceQuestionServiceClient
            .createMultipleChoiceQuestion(this.state.examId, question);

    }

    updateQuestion(question) {
        return this.MultipleChoiceQuestionServiceClient
            .updateMultipleChoiceQuestion(question.id, question);
    }

    deleteQuestion() {
        if (this.state.question.id !== '') {
            let ref = this.props.navigation.getParam('findAll');
            return this.MultipleChoiceQuestionServiceClient
                .deleteMultipleChoiceQuestion(this.state.question.id).then(() => ref(this.state.examId));
        }
    }

    addChoice() {
        let questions = this.state.question;
        let choices = questions.choices;
        choices.push(this.state.tempChoice);
        questions.choices = choices;
        this.setState({questions});
    }

    setCorrectChoice(choice) {
        let questions = this.state.question;
        questions.correctChoice = choice;
        this.setState({questions});
    }

    checkValidOfChoice() {
        if (this.state.tempChoice === '') {
            Alert.alert('The choice can not be empty');
            return false;
        }
        let choices = this.state.question.choices;

        if (choices.indexOf(this.state.tempChoice) !== -1) {
            Alert.alert('The choice already added');
            return false;
        }
        return true;
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
                    {this.renderChoice()}
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
                        value={this.state.question.description}/>
                    <FormValidationMessage>Description is required</FormValidationMessage>

                    <FormLabel>New Choice</FormLabel>
                    <FormInput onChangeText={(text) => {
                        this.setState({tempChoice: text})
                    }}
                               placeholder={'Please add a new Choice'}
                               backgroundColor="white"
                               value={this.state.question.tempChoice}/>
                    <FormValidationMessage>Choice is required</FormValidationMessage>
                    <Button title="Add a choice"
                            buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                            onPress={() => {
                                if (this.checkValidOfChoice()) {
                                    this.addChoice();
                                }
                            }}/>
                    {this.renderChoice()}

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

    deleteChoice(choiceId) {
        let question = this.state.question;
        //console.log(question.choices)
        question.choices.splice(choiceId, 1);
        //console.log(question.choices)
        this.setState(question);
    }

    renderChoice() {

        return (
            this.state.question.choices.map(
                (choice, index) => (
                    <View key={index}
                          style={{
                              flexDirection: 'row'
                          }}>
                        <View width={300} style={{marginTop:10}}>
                            <CheckBox
                                title={choice}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                containerStyle={this.state.question.correctChoice === choice && {backgroundColor: 'lightskyblue'}}
                                onPress={() => this.setCorrectChoice(choice)}
                                checked={this.state.question.correctChoice === choice}
                            />
                        </View>
                        <Icon name={'delete'} size={30} color='red'
                              onPress={() => this.deleteChoice(index)}/>
                    </View>


                )
            )
        )

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